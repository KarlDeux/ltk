<h1>Minimal exercise</h1>

This project uses require.js and jquery to fully function.
There's also some external libraries for code quality checks inside of tools folder.

The exercise can be run by opening the index.html file and typing into the input the 
file that you want to calculate.

Please, note that there's by default an attribute on Calc instance:
<br>
`Calc.init({`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`uMask: 'txt'`<br>
`});`
<br>

The purpose of the umask is to make sure that the file responds to an specific pattern.
In this case it will only accept files that contains `txt` at any point.

Feel free to change the class initiator so you can set up you own mask or totally remove those.

<h3>Application issues - aknowledged</h3>
Due to the nature of the ajax call asynchronous mode is disabled.<br>
Implementing a locking system to avoid object parse with no final elements inside was a must
in order to preserve data consistency.