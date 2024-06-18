
type AppAlert = {
    from: string,
}

type NotificationAlert = AppAlert & {
    post_id: string,
    type: 'like' | 'comment'
}

type ConnectRequestAlert = AppAlert & {
    fullname: string
}
 