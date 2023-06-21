export default function({ app, $axios }) {
    $axios.onError((error) => {
        if (error.response && error.response.status === 401) {
            app.$auth.reset();
            console.log(app.$auth)
        }

        return Promise.reject(error);
    });
}