const config = {
        backend: {
            url: 'https://chatservertradeforgeframes.vald5116.dev/api',
            token: false,
            visitorId:false
        }
    },
    helper = {
        inquiry: (src, callback) => {
            let {url = false, type = "GET", data = false, dataType = "json", headers = {}, loader = false} = src,
                listAjax = {
                    url,
                    type,
                    dataType,
                    headers,
                    success: (data) => {
                        console.log(data)
                        callback(data);
                    },
                    error: (err) => {
                        console.log(err.responseJSON)
                        switch (err.status) {
                            case 401:
                                console.log('no auth')
                                config.backend.token = false;
                                localStorage.setItem("Utoken", false);
                                window.location.replace("/login");
                                break
                            case 502:
                                helper.err();
                                break;
                            case 500:
                                helper.err();
                                break;
                            default:
                                if (err.responseJSON.name === "ValidationError"){
                                    err.responseJSON.data.map((arr)=>{
                                        window.notyf.open({
                                            type: "warning",
                                            message: arr.message,
                                            duration: 30000,
                                            dismissible: 1
                                        });
                                    })
                                } else
                                    window.notyf.open({
                                        type: "warning",
                                        message: err.responseJSON.message,
                                        duration: 30000,
                                        dismissible: 1
                                    });
                                callback(err.responseJSON);
                        }
                    }
                };
            if (config.backend.token) listAjax.headers.Authorization = `Bearer ${config.backend.token}`;
            if (data) listAjax.data = data;
            if(loader) $('main.content').html('<div class="spinner-border" style="margin: 0 auto;display: block;" role="status"><span class="sr-only">Loading...</span></div>')
            $.ajax(listAjax);
        },
        err: () => {
            $('body').html('').prepend(`<div class="container d-flex flex-column">
                                                <div class="row">
                                                    <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                                                        <div class="d-table-cell align-middle">
                                    
                                                            <div class="text-center">
                                                                <h1 class="display-1 font-weight-bold">500</h1>
                                                                <p class="h1">Internal server error.</p>
                                                                <p class="h2 font-weight-normal mt-3 mb-4">The server encountered something unexpected that didn't allow it to complete the request.
                                                                </p>
                                                                <a href="/" class="btn btn-primary btn-lg">Return to website</a>
                                                            </div>
                                    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`);
        }
    };
 const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
    .then(FingerprintJS => FingerprintJS.load())
     fpPromise
    .then(fp => fp.get())
    .then(result => {
      config.backend.visitorId = result.visitorId
    })
    
function editThem(){
    if ($(`#them`).attr(`href`)  === "/css/dark.css") {
        localStorage.setItem("theme", `light`);
        $(`#them`).attr(`href`, `/css/light.css`);
        $(`#themBtn`).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun align-middle me-2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`);
    }else {

        localStorage.setItem("theme", `dark`);
        $(`#them`).attr(`href`, `/css/dark.css`);
        $(`#themBtn`).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon align-middle me-2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`);
    }
}


switch (localStorage.getItem("theme")) {
    case "light":
        $(`#them`).attr(`href`, `/css/light.css`);
        $(`#themBtn`).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun align-middle me-2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`);
        break;
    case "dark":
        $(`#them`).attr(`href`, `/css/dark.css`);
    $(`#themBtn`).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon align-middle me-2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`);
        break;
    default:
        $(`#them`).attr(`href`, `/css/light.css`);
        $(`#themBtn`).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun align-middle me-2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`);
        break;
}
