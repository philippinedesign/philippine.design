const showIndex = {};


showIndex.output = async (element) => {

  // Extract data from element
  const url = element.getAttribute('data-spreadsheet-api');
  let text = element.innerHTML;
  if (element.hasAttribute('data-spreadsheet-api-initial-text') === false) {
    element.setAttribute('data-spreadsheet-api-initial-text', text);
  } else {
    text = element.getAttribute('data-spreadsheet-api-initial-text');
  }

  element.innerHTML = 'Loading...';

  let data = await fetch(url).then((r) => r.json());

  if (!Array.isArray(data)) {
    data = Object.values(data);
  }


  const replacement = data.map((object) => {
    Object.keys(object).forEach((k) => {
      object[k.trim()] = object[k];
    });

    return text.replace(/{{([^{}]*)}}/g, (match, key) => object[key.trim()]);
  });


  element.innerHTML = replacement.join('');

};


showIndex.render = async () => {

  //  console.log("rendering");

  const elements = document.querySelectorAll('[data-spreadsheet-api]');

  const promises = [];

  //  console.log("elements.length: " + elements.length);
  for (let i = 0; i < elements.length; i++) {
    //    console.log(elements);
    const element = elements[i];
    //    console.log(element);
    promises.push(showIndex.output(element));
  }

  return Promise.all(promises);
};


$(function () {

  showIndex.render();
  //  console.log("done");

  // not the first time?
  if (window.localStorage.getItem('washere') === 'true') {
    $("#loader").delay(300).fadeOut(300);
    //    console.log("been here");
    console.log("o.o");

  } else {
    console.log("..");
    window.localStorage.setItem('washere', 'true');
  }

});