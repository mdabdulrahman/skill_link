export const sendPushNotification = async (messages)=>{
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      }).then((response) => {
        console.log("Push notification sent successfully: ", response);
      } )
}