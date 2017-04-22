import {QueueService} from "../../src/server/QueueService";
import {expect} from 'chai';

describe("QueueService", function () {

    it("executes task and its events in right order", function (done) {
        let priority = 2;
        let capacity = 3;
        let queueService = new QueueService(capacity);

        let eventsExecuted = new Array();
        let onStartMark = "START";
        let onFinishMark = "FINISH";
        let onTaskMark = "TASK";

        let onStart = () => {
            eventsExecuted.push(onStartMark);
        };

        let onFinish = () => {
            eventsExecuted.push(onFinishMark);

            expect(eventsExecuted.length).to.be.equal(3);
            expect(eventsExecuted[0]).to.be.equal(onStartMark);
            expect(eventsExecuted[1]).to.be.equal(onTaskMark);
            expect(eventsExecuted[2]).to.be.equal(onFinishMark);

            done();
        };

        let task = () => {
            return new Promise((success, failure) => {
                eventsExecuted.push(onTaskMark);
                success();
            });
        }

        queueService.addTask(task, priority, onStart, onFinish);
    });

    it("it executes tasks with higher priority first", function (done) {

        let capacity = 2;
        let queueService = new QueueService(capacity);

        let conditionsChecked = false;
        let tasksCount = 8
        let taskTimeMs = 10;
        let tasksExecuted = new Array();

        let onStart = () => { };
        let onFinish = () => {

            if (tasksExecuted.length == tasksCount && !conditionsChecked) {
                conditionsChecked = true;
                expect(tasksExecuted[0]).to.be.equal("1");
                expect(tasksExecuted[1]).to.be.equal("2");
                expect(tasksExecuted[2]).to.be.equal("6");
                expect(tasksExecuted[3]).to.be.equal("7");
                expect(tasksExecuted[4]).to.be.equal("5");
                expect(tasksExecuted[5]).to.be.equal("8");
                expect(tasksExecuted[6]).to.be.equal("3");
                expect(tasksExecuted[7]).to.be.equal("4");
                done();
            } else if (tasksExecuted.length > tasksCount) {
                throw new Error("Too many tasks were executed");
            }
        };

        let task1 = getTaskWithId(tasksExecuted, taskTimeMs, "1");
        queueService.addTask(task1, 1, onStart, onFinish);

        let task2 = getTaskWithId(tasksExecuted, taskTimeMs, "2");
        queueService.addTask(task2, 2, onStart, onFinish);

        let task3 = getTaskWithId(tasksExecuted, taskTimeMs, "3");
        queueService.addTask(task3, 1, onStart, onFinish);

        let task4 = getTaskWithId(tasksExecuted, taskTimeMs, "4");
        queueService.addTask(task4, 1, onStart, onFinish);

        let task5 = getTaskWithId(tasksExecuted, taskTimeMs, "5");
        queueService.addTask(task5, 2, onStart, onFinish);

        let task6 = getTaskWithId(tasksExecuted, taskTimeMs, "6");
        queueService.addTask(task6, 5, onStart, onFinish);

        let task7 = getTaskWithId(tasksExecuted, taskTimeMs, "7");
        queueService.addTask(task7, 3, onStart, onFinish);

        let task8 = getTaskWithId(tasksExecuted, taskTimeMs, "8");
        queueService.addTask(task8, 2, onStart, onFinish);
    });

    function getTaskWithId(tasksExecuted, taskTimeMs, id) {
        return () => {
            return new Promise((success, failure) => {
                setTimeout(function () {
                    tasksExecuted.push(id);
                    success();
                }, taskTimeMs);
            });
        }
    }

});
