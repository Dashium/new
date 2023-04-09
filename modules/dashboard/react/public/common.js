async function getData(query) {
    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}


function getAllProjects(callback) {
    getData(`
        {
            projects {
                id
                name
                repo
                cluster {
                    id
                    name
                    alias
                    path
                }
            }
        }
    `).then((apiData) => {
        callback(apiData.data)
    });
}

function getProject(id, callback) {
    getData(`
        {
            project(id: ${id}) {
                id
                name
                cluster {
                    id
                    name
                    alias
                    path
                }
                repo
            }
        }
    `).then((apiData) => {
        callback(apiData.data);
    });
}

function getAllClusters(callback) {
    getData(`
        {
            clusters {
                id
                name
                alias
                path
            }
        }
    `).then((apiData) => {
        callback(apiData.data);
    });
}

function getCluster(id, callback) {
    getData(`
        {
            cluster(id: ${id}) {
                id
                name
                alias
                path
            }
        }
    `).then((apiData) => {
        callback(apiData.data);
    });
}