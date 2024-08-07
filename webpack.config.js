const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        auth: './src/auth.js',
        points: './src/points.js',
        user_profile: './src/user_profile.js',
        inactive_users: './src/inactive_users.js',
        rewards_archive: './src/rewards_archives.js',
        super_admin: './src/super_admin.js',
        push_notif: './src/admin_pushnotif.js',
        reward_verif: './src/reward_verif.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist/bundle'),
        filename: '[name].bundle.js'
    },
    watch: true
}