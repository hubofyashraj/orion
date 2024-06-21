
import { RootState, AppDispatch} from './store'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRequest, setAlert, setMessages, setNewPostsFlag, setPing } from './reducers'; // Adjust the import paths
import { Message } from '../chat/types';

const useSSE = () => {
  const messages = useSelector((state: RootState) => state.messages);
  const alerts = useSelector((state: RootState) => state.alerts);
  const requests = useSelector((state: RootState) => state.requests);
  const dispatch: AppDispatch = useDispatch();

  let eventSource = useRef<EventSource | null>(null);
  let retries = useRef(1);

  useEffect(() => {
    eventSource.current = new EventSource(`/api/sse`);

    const handleMessage = async (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);

      if (data.type === 'alert') {
        if ('fullname' in data.payload) {
          dispatch(setRequest([data.payload, ...requests]));
        } else {
          dispatch(setAlert([data.payload, ...alerts]));
        }
      } else if (data.type === 'message') {
        const msg = data.payload as Message;
        let msgs = messages.slice();
        const index = msgs.findIndex(([s, _]) => s == msg.sender);
        if (index !== -1) {
          msgs[index] = [msg.sender, msg];
        } else {
          msgs.push([msg.sender, msg]);
        }
        dispatch(setMessages([...msgs]));
      } else if (data.type === 'post') {
        dispatch(setNewPostsFlag(true));
      } else if (data.type === 'ping') {
        const ts1 = Date.now()
        const ts = parseInt((data.payload as string).replace('ping', ''))
        dispatch(setPing(`${ts1 - ts} ms`));
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
          alert('Please refresh to reconnect');
          clearInterval(interval);
          return;
        }
        dispatch(setPing(`retrying to connect ( ${retries.current} )`));
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
  }, [dispatch, messages, alerts, requests]);

  return null;
};

export default useSSE;


