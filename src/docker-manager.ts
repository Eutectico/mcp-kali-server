import Docker from 'dockerode';
import { Readable } from 'stream';

export class DockerManager {
  private docker: Docker;
  private containerName = 'mcp-kali';
  private imageName = 'mcp-kali-server:latest';

  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async ensureContainer(): Promise<Docker.Container> {
    try {
      const container = this.docker.getContainer(this.containerName);
      const info = await container.inspect();

      if (!info.State.Running) {
        await container.start();
      }

      return container;
    } catch (error) {
      // Container doesn't exist, create it
      return await this.createContainer();
    }
  }

  private async createContainer(): Promise<Docker.Container> {
    // Check if image exists
    try {
      await this.docker.getImage(this.imageName).inspect();
    } catch (error) {
      throw new Error(`Image ${this.imageName} not found. Please build it first using: docker-compose build`);
    }

    const container = await this.docker.createContainer({
      Image: this.imageName,
      name: this.containerName,
      Tty: true,
      OpenStdin: true,
      HostConfig: {
        Privileged: true,
        NetworkMode: 'host',
        CapAdd: ['NET_ADMIN', 'NET_RAW', 'SYS_ADMIN'],
        SecurityOpt: ['apparmor:unconfined'],
        Binds: [
          `${process.cwd()}/workspace:/workspace`
        ]
      }
    });

    await container.start();
    return container;
  }

  async executeCommand(command: string, timeout: number = 300000): Promise<string> {
    const container = await this.ensureContainer();

    const exec = await container.exec({
      Cmd: ['/bin/bash', '-c', command],
      AttachStdout: true,
      AttachStderr: true,
    });

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);

      exec.start({ Detach: false, Tty: false }, (err, stream) => {
        if (err) {
          clearTimeout(timeoutId);
          reject(err);
          return;
        }

        let output = '';

        if (stream) {
          stream.on('data', (chunk: Buffer) => {
            output += chunk.toString('utf8');
          });

          stream.on('end', () => {
            clearTimeout(timeoutId);
            // Remove Docker stream headers
            output = this.cleanDockerOutput(output);
            resolve(output);
          });

          stream.on('error', (error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
        } else {
          clearTimeout(timeoutId);
          reject(new Error('No stream returned from exec'));
        }
      });
    });
  }

  private cleanDockerOutput(output: string): string {
    // Remove Docker stream multiplexing headers (8 bytes per frame)
    return output.replace(/[\x00-\x08]/g, '');
  }

  async getContainerStatus(): Promise<string> {
    try {
      const container = this.docker.getContainer(this.containerName);
      const info = await container.inspect();
      return info.State.Running ? 'running' : 'stopped';
    } catch (error) {
      return 'not created';
    }
  }

  async stopContainer(): Promise<void> {
    try {
      const container = this.docker.getContainer(this.containerName);
      await container.stop();
    } catch (error) {
      // Container might not exist or already stopped
    }
  }

  async removeContainer(): Promise<void> {
    try {
      const container = this.docker.getContainer(this.containerName);
      await container.remove({ force: true });
    } catch (error) {
      // Container might not exist
    }
  }
}
