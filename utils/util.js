module.exports = {
    isNotBlack(str) {
        if (str !== '' && str !== null && str !== 'undefined') {
            return true
        }
        return false

    }
}