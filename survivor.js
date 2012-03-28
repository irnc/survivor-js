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
 * Below are two solutions one is a bullet prof brute force (which has a O(n)
 * complexity for both memory and time), the other one is a little bit more
 * intelligent (which is basically a O(1) for memory and time).
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
        players = 1000000;

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
        return calculateSurvivor(chairs.filter(isSkipped), chairs.length % 2 ? !deleteHead : deleteHead);
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
        var steps = [{
                deleteHead: true,
                numberOfPersons: chairs.length
            }],
            survivor = 1,
            before = 0,
            after = 0,
            latestIndex = 0;

        for (i = 1; true; ++i) {
            var prevStep = steps[i - 1],
                rawNumber = prevStep.numberOfPersons / 2, // '2' is a pettern step
                nextStep = {
                    deleteHead: prevStep.numberOfPersons % 2 ? !prevStep.deleteHead : prevStep.deleteHead,
                    numberOfPersons: prevStep.deleteHead ? Math.floor(rawNumber) : Math.ceil(rawNumber)
                };

            steps.push(nextStep);

            if (nextStep.numberOfPersons === 1) {
                break;
            }
        }

        steps.reverse();

        for (i = 1; i < steps.length; ++i) {
            before = before * 2;
            after = after * 2;

            if (steps[i].deleteHead) {
                before += 1;

                if (steps[i].numberOfPersons % 2 === 1) {
                    after += 1;
                }
            } else if (steps[i].numberOfPersons > before + after + 1) {
                after += 1;
            }
        }

        return before + 1;
    }

    console.time('inteligent');
    survivor = determineSurvivor(players);
    console.log('The survivor are sitting in a chair #' + survivor);
    console.timeEnd('inteligent');
}());