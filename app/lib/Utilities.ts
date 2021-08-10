export class Utility {
  /**
     * Exist process on the death of the AMQP channel
     * @param {*} channel AMQP channel
     */
  static amqpChannelCloseEventsHandler(queueName: string, channel: { on: (arg0: string, arg1: { (): never; (): never; }) => void; }) {
    // Event emitted on connection close
    channel.on('close', () => {
      process.exit(1);
    });
    // Event emitted on connection errored
    channel.on('error', () => {
      process.exit(1);
    });
  }
}
