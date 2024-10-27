const mongoose = require("mongoose");
const mongooseAutopopulate = require("mongoose-autopopulate");
const mongooseDelete = require("mongoose-delete");

const bonusSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		bonus: {
			type: Number,
			required: true,
		},
		aviable: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

class Bonus {
	static async findByUser(user) {
		return this.find({ user }).sort({ createdAt: -1 });
	}

	static getBonus(randomNumber) {
		if (randomNumber < 80) {
			return  0;
		} else if (randomNumber < 90) {
			return 1;
		} else if (randomNumber < 95) {
			return 2;
		} else if (randomNumber < 98) {
			return 3;
		} else if (randomNumber < 100) {
			return 4;
		} else {
			return 5;
		}

	}

	static async spin(user) {
		const lastSpin = await this.findOne({ user }).sort({ createdAt: -1 });  // Find the last spin
		const now = new Date();

		// Check if 24 hours have passed since the last spin
		if (!lastSpin || now - lastSpin.createdAt > 24 * 60 * 60 * 1000) {
			// Generate a random bonus
			const randomNumber = Math.floor(Math.random() * 100);
			const bonus = this.getBonus(randomNumber)
			
			// Create a new spin entry with the bonus
			const newSpin = new this({
				user,
				bonus,
			});
			await newSpin.save();

			return { success: true, bonus };
		} else {
			const timeRemaining = 24 * 60 * 60 * 1000 - (now - lastSpin.createdAt);
			return {
				success: false,
				message:
					"You can spin again in " +
					Math.floor(timeRemaining / (60 * 60 * 1000)) +
					" hours.",
			};
		}
	}

	useBonus() {
		this.aviable = false;
		return this.save();
	}
}

bonusSchema.plugin(mongooseAutopopulate);

bonusSchema.plugin(mongooseDelete);

bonusSchema.loadClass(Bonus);

module.exports = mongoose.model("Bonus", bonusSchema, "bonusses");
