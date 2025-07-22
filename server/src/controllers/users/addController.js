import prisma from "../../config/db.js";

export const userAdder = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check if the user already exists
        const existingUser = await prisma.profile.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        // Check if username is already taken
        const existingUsername = await prisma.profile.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUsername) {
            return res.status(409).json({ error: "Username already taken" });
        }


        // Create the new user
        const newUser = await prisma.profile.create({
            data: {
                name,
                username,
                email,
                password
            }
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

