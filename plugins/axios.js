export default function({ app, $axios }) {
    $axios.onError((error) => {
        if (error.response && error.response.status === 401) {
            app.$auth.reset();
        }

        return Promise.reject(error);
    });
}