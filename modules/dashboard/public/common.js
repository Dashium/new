/*-----------------------------------------------------------------------------------------------------------\
|  _____     _   _____ _             _ _          _____  _____  _____  __      _______  _____  _____  _____  |
| |_   _|   (_) /  ___| |           | (_)        / __  \|  _  |/ __  \/  |    / / __  \|  _  |/ __  \|____ | |
|   | | __ _ _  \ `--.| |_ _   _  __| |_  ___    `' / /'| |/' |`' / /'`| |   / /`' / /'| |/' |`' / /'    / / |
|   | |/ _` | |  `--. \ __| | | |/ _` | |/ _ \     / /  |  /| |  / /   | |  / /   / /  |  /| |  / /      \ \ |
|   | | (_| | | /\__/ / |_| |_| | (_| | | (_) |  ./ /___\ |_/ /./ /____| |_/ /  ./ /___\ |_/ /./ /___.___/ / |
|   \_/\__,_|_| \____/ \__|\__,_|\__,_|_|\___/   \_____/ \___/ \_____/\___/_/   \_____/ \___/ \_____/\____/  |
\-----------------------------------------------------------------------------------------------------------*/

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