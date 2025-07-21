'use strict';
import {NodeSSH} from "node-ssh";

const ssh = new NodeSSH();

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    REMOTE_ROOT,
    LOCAL_ROOT
} = process.env;

const config = {
    host: HOST,
    port: PORT,
    user: USER,
    pass: PASSWORD,
    remotePath: REMOTE_ROOT,
    sourcePath: LOCAL_ROOT
}

async function transferFolder() {
    try {
        await ssh.connect({
            host: HOST, // replace with your server address
            username: USER, // replace with your username
            password: PASSWORD, // replace with your password
        });

        console.log('Connected to server');

        // Upload entire folder recursively
        await ssh.putDirectory(LOCAL_ROOT, REMOTE_ROOT, {
            recursive: true,
            concurrency: 10,
            tick: (localPath, remotePath, error) => {
                if (error) {
                    console.error(`Failed to transfer ${localPath}: ${error}`);
                } else {
                    console.log(`Transferred ${localPath} to ${remotePath}`);
                }
            },
        });

        console.log('Folder transferred successfully');

        ssh.dispose();
    } catch (err) {
        console.error('Error:', err);
    }
}

transferFolder();
