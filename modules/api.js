const project = require('./projets/main');
const cluster = require('./cluster/main');

module.exports = {
    getAllCluster: async function() { return await cluster.getAllCluster(); },
    getAllProjects: async function() { return await project.getProjectAll(); },
    getCluster: async function(IDorName) { return await cluster.getCluster(IDorName); },
    getProject: async function(IDorName) { return await project.getProject(IDorName); },
    getProjectWithCluster: async function(IDorName) { return await project.getProjectWithCluster(IDorName); }
}