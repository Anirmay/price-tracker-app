const Notification = require('../models/Notification');
const User = require('../models/User');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.userId,
    })
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'sent' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subscribeToPushNotifications = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription object' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if subscription already exists
    const existingSubscription = user.pushSubscriptions.find(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (!existingSubscription) {
      user.pushSubscriptions.push({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      });

      await user.save();
      console.log(`Push subscription registered for user ${req.userId}`);
    }

    res.status(201).json({ message: 'Subscribed to push notifications successfully' });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

const unsubscribeFromPushNotifications = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: 'Endpoint is required' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.pushSubscriptions = user.pushSubscriptions.filter(
      (sub) => sub.endpoint !== endpoint
    );

    await user.save();
    console.log(`Push subscription removed for user ${req.userId}`);

    res.json({ message: 'Unsubscribed from push notifications successfully' });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
};
