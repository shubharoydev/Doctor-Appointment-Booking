require('dotenv').config();
const { buildSchema } = require('graphql');
const Doctor = require('../models/Doctor');

const schema = buildSchema(`
  type Doctor {
    _id: ID!              # MongoDB ObjectId, returned as string
    name: String          # Doctor's name
    experienceYears: Int  # Years of experience, matches database field
    specialist: String    # Medical specialty
    fees: Float          # Consultation fees
    picture: String      # URL to doctor's picture
  }

  type Query {
    doctors: [Doctor]     # Fetch all doctors
  }
`);

const root = {
  doctors: async () => {
    try {
      //console.log('GraphQL query for doctors executed (no API key)');
      const doctors = await Doctor.find({})
        .select('_id name experienceYears specialist fees picture')
        .lean();

      // Convert _id to string for GraphQL compatibility
      return doctors.map(doctor => ({
        ...doctor,
        _id: doctor._id.toString(),
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw new Error('Failed to fetch doctors');
    }
  },
};

module.exports = { schema, root };