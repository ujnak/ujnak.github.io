/*
 * メインのページから送信されたイベントに基づいて、レポートを制御する。
 */
const channel = new BroadcastChannel('exchange-event');
apex.debug.info("channel: ", channel);

channel.addEventListener("message", (event) => {
    apex.debug.info("event: ", event);
    if ( event.data.type === "refresh" ) {
        apex.region(event.data.target.report).refresh();
    }
});