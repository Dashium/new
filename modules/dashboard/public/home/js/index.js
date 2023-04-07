function project(data) {
    data.projects.forEach(projet => {
        // SIDEBAR
        $('.sidebar #projects').append(`<li class="subitem"><a href="/project/${projet.id}">${projet.name}</a></li>`);
    });
}
getAllProjects(project);

$('.sidebar .item').on('click', function() {
	$('.sidebar .item').removeClass('active');
	$(this).addClass('active');
	$('.sidebar .submenu').slideUp();
	$(this).children('.submenu').slideDown();
});