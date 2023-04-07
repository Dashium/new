const project = require('./projets/main');
const cluster = require('./cluster/main');

module.exports = {
    getProjectWithCluster: function(IDorName) { return project.getProjectWithCluster(IDorName) },
    getAllProjects: function() { return project.getProjectAll() },
    getProject: function(IDorName) { return project.getProject(IDorName) },
    getAllCluster: function() { return cluster.getAllCluster() },
    getCluster: function(IDorName) { return cluster.getCluster(IDorName) }
}