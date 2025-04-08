import React, { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeNotification } from "features/notification/notificationSlice";
import { useAppSelector, useAppDispatch } from "app/hooks";

const ToastNotifications: React.FC = () => {
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach((notification) => {
      const { message, type, id } = notification;
      toast(message, {
        type: type === "success" ? "success" : "error",
        onClose: () => dispatch(removeNotification(id)),
      });
    });
  }, [notifications, dispatch]);

  return <ToastContainer />;
};

export default ToastNotifications;
