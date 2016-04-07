import {
  // These are the basic GraphQL types
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} from 'graphql';

import { openEHRPartyToPatient } from '../lib/openehr/utils';
import { addPatient, getOpenEhr, openEHRBaseUrl, subjectNamespace } from './openEHR';

const Allergies = new GraphQLObjectType({
  name: 'Allergies',
  description: 'Represent the allergies of a patient',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of the Allergy the patient has'},
    date: {
      type: GraphQLString,
      description: 'Then date the patient identified the allergy'
    },
  })
});

const Patient = new GraphQLObjectType({
  name: 'Patient',
  description: 'Represent the type of a Patient in an openEHR party',
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: 'openEHR Party Id of the Patient'},
    mrn: {
      type: GraphQLString,
      description: 'Medical Record Number used for patient identification at RNSH'},
    ehrId: {
      type: GraphQLString,
      description: 'openEHR electronic health record identifier',
      resolve: (patient) => {
        const url = `${openEHRBaseUrl}ehr/?subjectId=${patient.mrn}&subjectNamespace=${subjectNamespace}`;
        return getOpenEhr(url, (ehrJson) => {
          return ehrJson.ehrId;
        });
      }
    },
    dob: {
      type: GraphQLString,
      description: 'Patient Date of birth'},
    firstname: {
      type: GraphQLString,
      description: 'Patient first name'},
    surname: {
      type: GraphQLString,
      description: 'Patient surname'},
    address: {
      type: GraphQLString,
      description: 'Patients main contact address'},
    phone: {
      type: GraphQLString,
      description: 'Patients phone number'},
    email: {
      type: GraphQLString,
      description: 'Patients email address'},
    gender: {
      type: GraphQLString,
      description: 'Patient Gender, either MALE or FEMALE'},
    tumorType: {
      type: GraphQLString,
      description: 'Tumour Type Either Prostate, Breast or CNS'},
    surgical: {
      type: GraphQLString,
      description: 'If a patient has had surgery on their tumour then true otherwise false'},
    allergies: {
      type: new GraphQLList(Allergies),
      description: 'A list of allergies that the patient may have'
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'RNSHSchema',
  description: 'Root of the RNSH Schema',
  fields: () => ({
    patients: {
      type: new GraphQLList(Patient),
      resolve: () => {
        const url = `${openEHRBaseUrl}demographics/party/query/?lastNames=*&rnsh.mrn=*`;
        return getOpenEhr(url, (json) => {
          const patients = json.parties.map((p) => {
            return openEHRPartyToPatient(p);
          });
          return patients;
        });
      }
    },
    patient: {
      type: Patient,
      args: {
        id: {type: new GraphQLNonNull(GraphQLInt), description: 'Return a specific patient'}
      },
      resolve: (source, {id}) => {
        const url = `${openEHRBaseUrl}demographics/party/${id}`;
        return getOpenEhr(url, (json) => {
          return openEHRPartyToPatient(json.party);
        });
      }
    },
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: {type: GraphQLString}
      },
      resolve: function (source, {message}) {
        return `your message is ${message}`;
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: 'RNSHMutations',
  fields: {
    createPatient: {
      type: Patient,
      description: 'Create a new patient.',
      args: {
        firstname: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patient first name'},
        surname: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patient surname'},
        gender: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patient Gender, either MALE or FEMALE'},
        dob: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patient Date of birth'},
        address: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patients main contact address'
        },
        mrn: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Medical Record Number used for patient identification at RNSH'
        },
        tumorType: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Tumour Type Either Prostate, Breast or CNS'
        },
        surgical: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'If a patient has had surgery on their tumour then true otherwise false'
        },
        phone: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patients phone number'
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Patients email address'
        }
      },
      resolve: function (source, args) {
        let patient = Object.assign({}, args);

        return addPatient(patient.firstname, patient.surname, patient.gender,
           patient.dob, patient.address, patient.mrn, patient.tumorType,
           patient.surgical, patient.phone, patient.email);
      }
    }
  }
});

const MySchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = MySchema;
