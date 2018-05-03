module.exports = `const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log(\`Master \${process.pid} is running\`);

	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(\`worker \${worker.process.pid} died => Exit code:\${code} Signal:\${signal}\`);
		const newWorker = cluster.fork();
		console.log(\`New worker \${newWorker.process.pid} created\`);
	});
} else {
	require('./app');
	console.log(\`Worker \${process.pid} started\`);
}`;