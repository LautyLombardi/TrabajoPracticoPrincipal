
import { io } from 'socket.io-client';

// Your server's IP address and port
//   - locally hosted: "http://localhost:[port]"
//   - in the same network, in the case of a RaspberryPi:
const URL = "http://172.24.52.121:5000";

export const socket = io(URL);