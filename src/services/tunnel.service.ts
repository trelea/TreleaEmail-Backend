import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";

const startTunnel = () => {
    const tunnel: ChildProcessWithoutNullStreams = spawn('autossh', ['-M', '0', '-R', `trelea-dev:80:${process.env.SERVER}:${process.env.PORT}`, 'serveo.net'])
    tunnel.stdout.on('data', data => console.log(data.toString()))
}

export { startTunnel };
