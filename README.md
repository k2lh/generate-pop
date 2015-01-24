working demo: http://generate.karinoyo.com/pop/

Now that you know the intended behavior, try this:

1) Figure out where there are repeating actions (you'll see a few of these in there, already). Separate these into a directive, service, or factory. 
2) The action goes from left (the selections) to the right (the first set of results). There's a watch collection for the left, and buried inside that is (yes, really) a second watch on the results of the first. Redo the architecture of the controllers/page to reflect this UI behavior.

Hints: 

You can have more than one controller on a page, and not necessarily nested. 
Factories are handy for saving data for later retrieval.

