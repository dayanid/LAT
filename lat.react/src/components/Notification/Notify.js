import React from 'react';
import NotificationAlert from 'react-notification-alert';

export const notify = (notificationAlertRef, place) => {
  if (notificationAlertRef && notificationAlertRef.current) {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {
      place: place,
      message: (
        <div>
          <div>
            Welcome to <b>Paper Dashboard React</b> - a beautiful freebie for
            every web developer.
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7
    };
    notificationAlertRef.current.notificationAlert(options);
  } else {
    console.error('notificationAlertRef is not properly defined or initialized');
  }
};

export const Notifications = () => {
  const notificationAlertRef = React.useRef();

  // Call notify function with desired place parameter
  const handleNotify = () => {
    notify(notificationAlertRef, "tr"); // Update "tr" with the desired place for the notification
  };

  return (
    <div>
      <button onClick={handleNotify}>Notify</button> {/* Add a button to trigger the notification */}
      {/* Render the NotificationAlert component */}
      <NotificationAlert ref={notificationAlertRef} />
    </div>
  );
};
