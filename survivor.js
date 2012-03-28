/*global console: false */

/**
 * Task:
 *
 * You are in a room with a circle of 100 chairs. The chairs are numbered
 * sequentially from 1 to 100.
 *
 * At some point in time, the person in chair #1 will be asked to leave. The
 * person in chair #2 will be skipped, and the person in chair #3 will be asked
 * to leave. This pattern of skipping one person and asking the next to leave
 * will keep going around the circle until there is one person left… the
 * survivor.
 *
 * Write a program to determine which chair the survivor is sitting in?
 *
 *
 * Below are two solutions (written in JavaScript for node.js and modern Web
 * browsers) one is a bullet prof brute force (which has a O(n) complexity for
 * both memory and time), the other one is a little bit more intelligent (which
 * is basically a O(1) for memory and time).
 *
 * Test results for a 100 chairs:
 *     The survivor are sitting in a chair #72
 *     brute force method: 5ms
 *     The survivor are sitting in a chair #72
 *     intelligent method: 0ms
 *
 * Test results for a 1,000,000 chairs:
 *     The survivor are sitting in a chair #951424
 *     brute force method: 106ms
 *     The survivor are sitting in a chair #951424
 *     intelligent method: 0ms
 *
 * @author irnc
 */
(function () {
    'use strict';

    var i,
        // number of a chair the survivor is sitting on (counting from 1)
        survivor,
        // array representing circular queue of a chairs
        chairs = [],
        // number of players sitting on chairs
        players = 100;

    // put the players on their chairs
    for (i = 1; i <= players; ++i) {
        chairs.push(i);
    }

    /**
     * Calculate survivor by removing each second chair in a circle
     *
     * This is a brute force method which needs an array of all chair numbers.
     * Thus it is a memory consuming and slow.
     *
     * @param array chairs
     * @param boolean deleteHead
     * @return integer
     */
    function calculateSurvivor(chairs, deleteHead) {
        if (chairs.length === 1) {
            return chairs.pop();
        }

        /**
         * Tell if person in a chair with specific index must be skipped
         *
         * Skip chairs with odd indeces (1, 3, etc.) if head must be deleted or
         * with even indeces (0, 2, etc.) if head must be preserved.
         *
         * @return boolean TRUE if person in a chair skipped in this iteration
         */
        function isSkipped(element, index) {
            return index % 2 === (deleteHead ? 1 : 0);
        }

        /* On a first iteration chairs removal starts from a head (e.g. the
         * first element in an array with 0 index). On successive iterations
         * whenever head deleted or not is determined by a number of chairs
         * still occupied in a previous iteration and can only toggle when this
         * number is odd.
         */
        return calculateSurvivor(chairs.filter(isSkipped), deleteHead ^ (chairs.length % 2));
    }

    console.time('brute force method');
    survivor = calculateSurvivor(chairs, true);
    console.log('The survivor are sitting in a chair #' + survivor);
    console.timeEnd('brute force method');

    /**
     * Determine survivor by calculating its position from number of chairs only
     *
     * Intelligent method that does not need full array of chairs, just the
     * number of it. Thus it is low on memory usage and fast, basically O(1).
     *
     * @return integer
     */
    function determineSurvivor(numberOfChairs) {
        /* Determine iteration steps needed to find the survivor. For each step
         * we need to know whenever head is deleted or not and a number of
         * chairs before iteration begins. Each successive step will have half
         * of a chairs from a previous step (really half plus minus one after
         * step with odd number of chairs).
         */
        var previous, step, round,
            steps = [{
                deleteHead: true,
                chairs: chairs.length
            }],
            before = 0;

        for (i = 1; true; ++i) {
            previous = steps[i - 1];
            round = Math[previous.deleteHead ? 'floor' : 'ceil'];
            step = {
                deleteHead: previous.deleteHead ^ previous.chairs % 2,
                chairs: round(previous.chairs / 2) // half from previous
            };

            steps.push(step);

            if (step.chairs === 1) {
                break;
            }
        }

        steps.reverse();

        /* Calculate the number of chairs before survivor's one, the survivor
         * is sitting on the next one.
         */
        for (i = 1; i < steps.length; ++i) {
            before = before * 2;

            if (steps[i].deleteHead) {
                before += 1;
            }
        }

        return before + 1;
    }

    console.time('intelligent method');
    survivor = determineSurvivor(players);
    console.log('The survivor are sitting in a chair #' + survivor);
    console.timeEnd('intelligent method');
}());
