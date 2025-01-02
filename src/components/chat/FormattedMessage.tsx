import React from 'react';

const FormattedMessage = ({ text }) => {
  // Function to format text between ** as bold
  const formatBoldText = (text) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Function to identify and format numbered lists, headings, and paragraphs
  const formatText = (text) => {
    const lines = text.split('\n');
    const formattedContent = [];
    let currentList = [];
    let inList = false;
    let listStartIndex = 1;

    lines.forEach((line, index) => {
      // Check for markdown headings (###)
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      // Check for numbered lists
      const listMatch = line.match(/^(\d+)[.)] *(.+)$/);

      if (headingMatch) {
        // If we were in a list, close it
        if (inList && currentList.length > 0) {
          formattedContent.push(
            <ol key={`list-${formattedContent.length}`}
                className="list-decimal ml-6 my-4 space-y-2"
                start={listStartIndex}>
              {currentList}
            </ol>
          );
          currentList = [];
          inList = false;
        }

        // Add heading with appropriate size based on number of #
        const headingLevel = headingMatch[1].length;
        const headingText = headingMatch[2];
        const headingClasses = {
          1: "text-2xl font-bold my-4",
          2: "text-xl font-bold my-3",
          3: "text-lg font-bold my-2",
          4: "text-base font-bold my-2",
          5: "text-sm font-bold my-1",
          6: "text-xs font-bold my-1"
        };

        formattedContent.push(
          <div key={`heading-${index}`} className={headingClasses[headingLevel]}>
            {formatBoldText(headingText)}
          </div>
        );
      } else if (listMatch) {
        if (!inList) {
          inList = true;
          listStartIndex = parseInt(listMatch[1]);
        }

        currentList.push(
          <li key={`item-${index}`} className="mb-2" value={parseInt(listMatch[1])}>
            {formatBoldText(listMatch[2])}
          </li>
        );
      } else {
        if (inList && currentList.length > 0) {
          formattedContent.push(
            <ol key={`list-${formattedContent.length}`}
                className="list-decimal ml-6 my-4 space-y-2"
                start={listStartIndex}>
              {currentList}
            </ol>
          );
          currentList = [];
          inList = false;
        }

        // Only create a paragraph if there's actual content
        if (line.trim()) {
          formattedContent.push(
            <p key={`p-${index}`} className="mb-4">
              {formatBoldText(line)}
            </p>
          );
        }
      }
    });

    // Don't forget to add the last list if we were still in one
    if (currentList.length > 0) {
      formattedContent.push(
        <ol key={`list-${formattedContent.length}`}
            className="list-decimal ml-6 my-4 space-y-2"
            start={listStartIndex}>
          {currentList}
        </ol>
      );
    }

    return formattedContent;
  };

  return (
    <div className="text-sm md:text-base">
      {formatText(text)}
    </div>
  );
};

export default FormattedMessage;