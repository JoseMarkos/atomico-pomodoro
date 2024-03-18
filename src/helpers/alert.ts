export function alert(msg: string) {
  var notification = new Notification('Pomodoro', {
    body: msg,
    // icon: 'icono.png' // URL del icono de la notificación
  });
}

export const requestPermission = () => {
  if ('Notification' in window) {
    // Solicitar permiso para enviar notificaciones
    Notification.requestPermission().then(function(result) {
      if (result === 'granted') {
      }
    });
  } else {
    // Si el navegador no soporta notificaciones push
    alert('Lo siento, tu navegador no soporta notificaciones push.');
  }
};