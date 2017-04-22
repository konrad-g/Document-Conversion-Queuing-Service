function QueueTask(task, priority, onStart, onFinish) {
    this.task = task;
    this.onStart = onStart;
    this.priority = priority;
    this.onFinish = onFinish;
}

export function QueueService(initCapacity) {

    this.capacity = initCapacity;

    let processing = new Array();
    let queue = new Array();

    this.addTask = (task, priority, onStart, onFinish) => {

        let queueTask = new QueueTask(task, priority, onStart, onFinish);

        // Set correct priority
        let position = 0;

        for (let i = 0; i < queue.length; i++) {
            // By default put this task after current task
            position = i + 1;

            let currentTask = queue[i];
            if (currentTask.priority < priority) {
                // Place this task before task with lower priority
                position = i;
                break;
            }
        }

        queue.splice(position, 0, queueTask);
        this.executeNext();
    }

    this.executeNext = () => {
        if (processing.length < this.capacity &&
            queue.length > 0) {

            let self = this;
            let task = queue.shift();
            processing.push(task);

            task.onStart();

            let onFinalFinish = (error) => {

                // Remove task from the queue
                let index = processing.indexOf(task);
                if (index >= 0) {
                    processing.splice(index, 1);
                }

                task.onFinish();
                self.executeNext();
            };

            task.task()
                .then(onFinalFinish)
                .catch(onFinalFinish);
        }
    }
}
