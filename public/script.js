window.onload = function () {
    var converter = new showdown.Converter();
    var pad = document.getElementById('pad');
    var markdownArea = document.getElementById('markdown');

    // Make the tab key insert a tab character in the text area
    pad.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') { // Check for Tab key press
            var start = this.selectionStart;
            var end = this.selectionEnd;
            var value = pad.value;

            // Insert a tab character at the cursor position
            pad.value = value.substring(0, start) + "\t" + value.substring(end);

            // Set the cursor to the correct position after inserting the tab
            this.selectionStart = this.selectionEnd = start + 1;

            e.preventDefault(); // Prevent default tab behavior
        }
    });

    var previousMarkdownValue;

    // Convert markdown text to HTML
    var convertTextAreaToMarkdown = function () {
        var markdownText = pad.value;
        previousMarkdownValue = markdownText;
        var html = converter.makeHtml(markdownText);
        markdownArea.innerHTML = html;
    };

    var didChangeOccur = function () {
        return previousMarkdownValue !== pad.value;
    };

    // Check every second if the text area content has changed
    setInterval(function () {
        if (didChangeOccur()) {
            convertTextAreaToMarkdown();
        }
    }, 1000);

    // Convert markdown on input change
    pad.addEventListener('input', convertTextAreaToMarkdown);

    // Real-time collaboration functionality based on URL path
    if (document.location.pathname.length > 1) {
        // Initialize real-time collaboration
        var ws = new WebSocket('ws://' + window.location.host);

        ws.onopen = function () {
            console.log("WebSocket connection opened");
        };

        ws.onmessage = function (event) {
            var data = JSON.parse(event.data);
            if (data.type === 'update') {
                pad.value = data.content;
                convertTextAreaToMarkdown();
            }
        };

        ws.onerror = function (error) {
            console.error("WebSocket error: ", error);
        };

        // Attach textarea for real-time sync
        pad.oninput = function () {
            var message = {
                type: 'update',
                content: pad.value
            };
            ws.send(JSON.stringify(message));
        };
    } else {
        // Just handle markdown conversion without WebSocket
        convertTextAreaToMarkdown();
    }

    convertTextAreaToMarkdown();

};
