class Utils {

    static formatData(data) {
        return (data.getDate() + '/' + data.getMonth() + 1 + '/' + data.getFullYear() + ' ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds());

    }
}