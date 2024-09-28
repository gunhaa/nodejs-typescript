



document.addEventListener("click", function (e) {

    let btn = document.querySelectorAll("button");
    console.log(e.target.id);
    console.log(!isNaN(e.target.id));


    if (!isNaN(e.target.id)) {

        fetch("/login/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              delnum: e.target.id
            }),
          })
            .then((response) => response.json())
            .then((result) => console.log("결과: ", result));

    };
});
