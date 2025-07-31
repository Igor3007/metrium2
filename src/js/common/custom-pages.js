document.addEventListener('DOMContentLoaded', function (event) {

    const {location} = window;
    const params = new URLSearchParams(location.search);

    const estateListView = () => {
        if (params.get('view') === 'list') {
            document.querySelector('.estate-list')?.classList.add('list');
        }
    };


    switch(location.pathname) {
        case '/city.html':
            estateListView();
            break;
    }

});
