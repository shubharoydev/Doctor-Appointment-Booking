const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Doctor {
    _id: ID!
    user: ID
    name: String!
    email: String!
    contactNumber: String!
    experienceYears: Int!  # Changed from experienceNumber to match database document
    specialist: String!
    education: String!
    registrationNo: String
    language: String!
    fees: Float!
    about: String!
    picture: String
    schedule: [Schedule]
    qualification: String!
    gender: String!
    location: String!
    achievement: String!
  }

  type Schedule {
    _id: ID
    day: String!
    places: [Place]
  }

  type Place {
    _id: ID
    place: String!
    timeInterval: TimeInterval
    maxPatients: Int
  }

  type TimeInterval {
    start: String!
    end: String!
  }

  type Appointment {
    _id: ID!
    user: ID!  # Changed from userId to match appointmentSchema
    doctor: ID!  # Changed from doctorId to match appointmentSchema
    day: String!
    date: String
    place: String!
    timeInterval: TimeInterval!
    bookedAt: String!
    status: String!
  }

  type Query {
    getAllDoctors: [Doctor]
    getDoctorById(id: ID!): Doctor
    getDoctorAppointments(doctorId: ID!): [Appointment]
  }

  type Mutation {
    loginDoctor(email: String!, password: String!): AuthPayload
  }

  type AuthPayload {
    token: String
    doctor: Doctor
  }
`;

module.exports = typeDefs;