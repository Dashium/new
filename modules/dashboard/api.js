const DashiummAPI = require('../api');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        project(id: Int!): Project
        projects: [Project]
        cluster(id: Int!): Cluster
        clusters: [Cluster]
    }

    type Project {
        id: Int
        name: String
        repo: String
        cluster: Cluster
    }

    type Cluster {
        id: Int
        name: String
        alias: String
        path: String
    }
`);

const resolvers = {
    project: ({ id }) => DashiummAPI.getProjectWithCluster(id),
    projects: () => DashiummAPI.getAllProjects(),
    cluster: ({ id }) => require('../cluster/main').getCluster(id),
    clusters: () => DashiummAPI.getAllCluster(),
};

module.exports = {
    schema,
    resolvers
}