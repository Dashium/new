const project = require('./projets/main');
const cluster = require('./cluster/main');

module.exports = {
    getProjectWithCluster: async function(IDorName) { return await project.getProjectWithCluster(IDorName); },
    getAllProjects: async function() { return await project.getProjectAll(); },
    getProject: async function(IDorName) { return await project.getProject(IDorName); },
    getAllCluster: async function() { return await cluster.getAllCluster(); },
    getCluster: async function(IDorName) { return await cluster.getCluster(IDorName); }
}