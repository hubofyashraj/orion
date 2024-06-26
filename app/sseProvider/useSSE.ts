
import { useEffect, useRef } from 'react';
import useAlerts from '../state-store/alertsStore';
import useMessages from '../state-store/messagesStore';
import usePing from '../state-store/pingStore';
import usePostsAlert from '../state-store/newPostsStore';
import { getUnreadMessages } from '../api/chat/chat';
import { fetchOldRequests } from '../api/search/search';

const useSSE = () => {

    const {
        addAlert, addRequest, setRequests
    } = useAlerts();


    const {
        addMessage
    } = useMessages();


    const {
        setPing
    } = usePing();


    const {
        setNewPosts
    } = usePostsAlert();


  let eventSource = useRef<EventSource | null>(null);
  let retries = useRef(1);

  useEffect(() => {
    eventSource.current = new EventSource(`/api/sse`);

    const handleMessage = (ev: MessageEvent) => {
      if(!(ev.data as string).startsWith('{')) return;
      
      const data = JSON.parse(ev.data);

      if (data.type === 'alert') {
        if ('fullname' in data.payload) {
            addRequest(data.payload)
        } else {
            addAlert(data.payload)
        }
      } else if (data.type === 'message') {
        const msg = data.payload as Message;
        addMessage(msg.sender, msg);
      } else if (data.type === 'post') {
        setNewPosts(true);
      } else if (data.type === 'ping') {
        const ts1 = Date.now()
        const ts = parseInt((data.payload as string))
        setPing(`${ts1-ts} ms`);
      }
    };

    const handleError = (ev: Event) => {
      console.log('error in eventsource', ev);
    };

    const onConnect = () => {
      retries.current = 1;
    };

    eventSource.current.addEventListener('message', handleMessage);
    eventSource.current.onerror = handleError;
    eventSource.current.onopen = onConnect;

    const interval = setInterval(() => {
      if (eventSource.current!.readyState !== EventSource.OPEN) {
        retries.current++;
        if (retries.current === 10) {
          setPing('Refresh to reconnect!!!!')
          clearInterval(interval);
          return;
        }
        setPing(`Reconnecting... (${retries.current})`);
        eventSource.current?.close(); // Close previous instance
        eventSource.current = new EventSource('/api/sse');
        eventSource.current.addEventListener('message', handleMessage);
        eventSource.current.onerror = handleError;
        eventSource.current.onopen = onConnect;

      }
    }, 5000);

    return () => {
      eventSource.current?.close();
      clearInterval(interval);
    };
  }, [addAlert, addMessage, addRequest, setNewPosts, setPing]);

  /**
   * fetching unread messages
   */
  useEffect(()=>{
    getUnreadMessages().then((jsonString) => {
      if(jsonString) {
        const messages = JSON.parse(jsonString).messages as Message[];
        messages.forEach(message => addMessage(message.sender, message))
      }
    })

    
  }, [addMessage])

  useEffect(()=>{
    fetchOldRequests().then((jsonString) => {
      if(jsonString) {
        const requests = JSON.parse(jsonString).requests as ConnectRequest[];
        setRequests(requests.map((request) => ({from: request.sender, fullname: ''})))
      }
    })
  }, [setRequests])


  return null;
};

export default useSSE;


