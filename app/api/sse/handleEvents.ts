export default function handle(eventSource: EventSource) {
    eventSource.onmessage = (ev) => {
        console.log(ev);
        
    }
}