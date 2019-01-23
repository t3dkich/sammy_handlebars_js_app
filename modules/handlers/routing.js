const routing = (() => {
    async function getCarEdit(ctx) {
        ctx.isAuth = auth.isAuth()
        if (auth.isAuth()) ctx.username = sessionStorage.getItem('username')
        let id = ctx.params.id
        let endpoint = `cars/${id}`
        ctx.car = await remote.get('appdata', endpoint, 'kinvey')
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/listings/edit.hbs')
        })
    }

    function getCreate(ctx) {
        ctx.isAuth = auth.isAuth()
        if (auth.isAuth()) ctx.username = sessionStorage.getItem('username')
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/listings/create.hbs')
        })
    }

    function allListings(ctx) {
        ctx.redirect('#/homePage')
    }

    async function homePage(ctx) {
        ctx.carsList = await carServices.listAllCars()
        ctx.isAuth = auth.isAuth()
        ctx.carsNum = ctx.carsList.length === 0
        ctx.carsList.forEach(e => {
            e['isAuthor'] = e._acl.creator === sessionStorage.getItem('userId')
        })
        ctx.username = sessionStorage.getItem('username')
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            singleCar: 'templates/homePage/singleCar.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/homePage/homePage.hbs')
        })
    }

    function logout(ctx) {
        auth.logout()
        sessionStorage.clear()
        ctx.redirect('#/home')
        notify.showInfo('Logout successful.')
    }

    function getLogin(ctx) {
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/auth/login.hbs')
        })
    }

    function postLogin(ctx) {
        let username = ctx.params.username
        let password = ctx.params.password
        if (!/[a-zA-Z]{3,}/.test(username)) {
            notify.showError('Username must be at least 3 english letters long!')
        } else if (!/[a-zA-Z0-9]{6,}/.test(password)) {
            notify.showError('Password must be at least 6 english letters or digits long!')
        } else {
            auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData)
                    notify.showInfo('Login successful.')
                    ctx.redirect('#/homePage')
                })
        }

    }

    function postRegister(ctx) {
        let username = ctx.params.username
        let password = ctx.params.password
        let repeatPass = ctx.params.repeatPass
        if (!/[a-zA-Z]{3,}/.test(username)) {
            notify.showError('Username must be at least 3 english letters long!')
        } else if (!/[a-zA-Z0-9]{6,}/.test(password)) {
            notify.showError('Password must be at least 6 english letters or digits long!')
        } else if (password !== repeatPass) {
            notify.showError('Passwords do not match!')
        } else {
            auth.register(username, password)
                .then((userData) => {
                    auth.saveSession(userData)
                    notify.showInfo('User registration successful.')
                    ctx.redirect('#/homePage')
                })
                .catch(notify.handleError)
        }
    }

    function getRegister(ctx) {
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/auth/register.hbs')
        })
    }

    function welcomePage(ctx) {
        ctx.isAuth = auth.isAuth()
        if (auth.isAuth()) ctx.username = sessionStorage.getItem('username')
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            if (!auth.isAuth()) {
                this.partial('templates/welcomePage.hbs')
            } else {
                ctx.redirect('#/homePage')
            }

        })
    }

    return {
        welcomePage,
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        logout,
        homePage,
        allListings,
        getCreate,
        getCarEdit
    }
})()