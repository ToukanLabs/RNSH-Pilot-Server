import {
  // These are the basic GraphQL types
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} from 'graphql';

import fetch from 'isomorphic-fetch';
// import PatientsList from './data/patients';
import OpenEHR from '../lib/openehr';
import { openEHRPartyToPatient } from '../lib/openehr/utils';

const baseUrl = 'https://ehrscape.code-4-health.org/rest/v1/';
const subjectNamespace = 'rnsh.mrn';
/* const username = 'rnshpilot_c4h';
const password = 'lIsombRI'; */

const code4health = new OpenEHR(
  'https://ehrscape.code-4-health.org/rest/v1/',
  'rnsh.mrn',
  'rnshpilot_c4h',
  'lIsombRI'
);

const getOpenEhr = (url, callback) => {
  const options = {
    headers: {
      'Authorization': code4health.getAuthorizationHeader()
    },
  };
  return fetch(url, options)
    .then((response) => {
      if (!response.ok || response.status === 204) {
        let error = new Error('Bad response from server');
        error.statusCode = response.status;
        throw error;
      }
      return response.json();
    })
    .then((json) => {
      return callback(json);
    })
    .catch((ex) => {
      console.log('parsing failed', ex);
      throw ex;
    });
};

const postOpenEhr = (url, body, callback) => {
  let options = {
    method: 'post',
    headers: {
      'Authorization': this.getAuthorizationHeader(),
      'Accept': 'application/json'
    }
  };

  if (body !== null) {
    options.body = body;
    options.headers['Content-Type'] = 'application/json';
  }

  return fetch(url, options)
    .then(function (response) {
      if (response.status >= 400) {
        return response.text();
      }
      return response.json();
    })
    .then((json) => {
      return callback(json);
    })
    .catch((ex) => {
      console.log('parsing failed', ex);
      throw ex;
    });
};

const Allergies = new GraphQLObjectType({
  name: 'Allergies',
  description: 'Represent the allergies of a patient',
  fields: () => ({
    name: {type: GraphQLString},
    date: {type: GraphQLString},
  })
});

const Patient = new GraphQLObjectType({
  name: 'Patient',
  description: 'Represent the type of an author of a blog post or a comment',
  fields: () => ({
    id: {type: GraphQLString},
    mrn: {type: GraphQLString},
    ehrId: {
      type: GraphQLString,
      resolve: (patient) => {
        const url = `${baseUrl}ehr/?subjectId=${patient.mrn}&subjectNamespace=${subjectNamespace}`;
        return getOpenEhr(url, (ehrJson) => {
          return ehrJson.ehrId;
        });
      }
    },
    dob: {type: GraphQLString},
    firstname: {type: GraphQLString},
    surname: {type: GraphQLString},
    address: {type: GraphQLString},
    phone: {type: GraphQLString},
    email: {type: GraphQLString},
    gender: {type: GraphQLString},
    tumorType: {type: GraphQLString},
    surgical: {type: GraphQLString},
    allergies: {
      type: new GraphQLList(Allergies),
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
        const url = `${baseUrl}demographics/party/query/?lastNames=*&rnsh.mrn=*`;
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
        const url = `${baseUrl}demographics/party/${id}`;
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
  name: 'BlogMutations',
  fields: {
    createPatient: {
      type: Patient,
      description: 'Create a new patient',
      args: {
        firstname: {type: new GraphQLNonNull(GraphQLString)},
        surname: {type: new GraphQLNonNull(GraphQLString)},
        gender: {type: new GraphQLNonNull(GraphQLString)},
        dob: {type: new GraphQLNonNull(GraphQLString)},
        address: {type: new GraphQLNonNull(GraphQLString)},
        mrn: {type: new GraphQLNonNull(GraphQLString)},
        tumorType: {type: new GraphQLNonNull(GraphQLString)},
        surgical: {type: new GraphQLNonNull(GraphQLString)},
        phone: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: function (source, {...args}) {
        /* let post = args;
        var alreadyExists = _.findIndex(PostsList, p => p._id === post._id) >= 0;
        if(alreadyExists) {
          throw new Error("Post already exists: " + post._id);
        }

        if(!AuthorsMap[post.author]) {
          throw new Error("No such author: " + post.author);
        }

        if(!post.summary) {
          post.summary = post.content.substring(0, 100);
        }

        post.comments = [];
        post.date = {$date: new Date().toString()}

        PostsList.push(post);
        return post;*/
      }
    }
  }
});

const MySchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

module.exports = MySchema;
