import prisma from "../../config/db.js";

export const crewAdder = async (req, res) => {
    const { name, job, description, imageUrls } = req.body;

    try {
        // Validate required fields
        if (!name || !job || !description) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // Validate job field
        if (!Array.isArray(job) || job.length === 0) {
            return res.status(400).json({ error: "Job must be a non-empty array" });
        }


        // Create new crew member
        const newCrewMember = await prisma.CastCrew.create({
            data: {
                name,
                job,
                description,
                imageUrls: {
                    set: imageUrls || []
                }
            }
        });
        
        res.status(201).json(newCrewMember);
    } catch (error) {
        console.error("Error creating crew member:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const crewAdderMany = async (req, res) => {
    const crewMembers = req.body;

    try {
        // Validate input
        if (!Array.isArray(crewMembers) || crewMembers.length === 0) {
            return res.status(400).json({ error: "Input must be a non-empty array" });
        }

        // Create multiple crew members
        const createdCrewMembers = await prisma.CastCrew.createMany({
            data: crewMembers,
            skipDuplicates: true // Skip duplicates if any
        });

        res.status(201).json({ count: createdCrewMembers.count });
    } catch (error) {
        console.error("Error creating multiple crew members:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}