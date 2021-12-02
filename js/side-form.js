$(document).ready(function() {	

	//Create Html for Skipped steps in the side list (keep them display none)
	var stepCard = `
    <div class="card steps-card d-none">
        <div class="card-header"></div>
        <div class="card-body"></div>
    </div>
    `;

	//Count all the navs (all the form steps)
	var navCount = $(".nav-item").length;

	//Append all the skip-steps-cards to skip-steps-container but keep in display none
	for (var i = 0; i < navCount; i++) {
		$(".steps-counter-div").append(stepCard);
		$(".steps-card").last().find(".card-header").text("Step: " + (i + 1));
	}

	//On Next button click check for mandatory inputs validation and optional inputs skip list populate
	$('.next-btn').click(function(e) {
		e.preventDefault();

		//get index of active tab
		var tabPaneIndex = $('.tab-pane.active').index('.tab-pane');

		if ($(".steps-card").eq(tabPaneIndex).length > 0) {
			//remove all the skip-labels of the cuurent step-card
			$(".steps-card").eq(tabPaneIndex).find(".skip-steps-label").remove();
		}

		var dataMandatoryLength = $('.tab-pane.active').find('[data-myinput=mandatory-input]').length;
		var filledElementMandatoryCount = $('.tab-pane.active').index('.tab-pane') - $('.tab-pane.active').index('.tab-pane');

		//Loop through all the mandatory inputs and validate them
		$('.tab-pane.active [data-myinput=mandatory-input]').each(function(index, element) {
			if ($(this).data('myinput') === "mandatory-input") {

				//check for madatory radio button
				if ($(this).hasClass("radio-div")) {
					if ($(this).find(":checked").length === 0) {
						if ($(this).siblings('label.tab-error').length === 0) {
							$(this).after('<label class="tab-error"></label>')
							$(".tab-error").css(tabErrorStyle);
							$(this).next(".tab-error").text("Please fill this field");
							return false;
						} else {
							return false;
						}

					} else {
						//remove validation error if input is filled properly
						$(this).next(".tab-error").remove();

						if (filledElementMandatoryCount <= dataMandatoryLength) {
							filledElementMandatoryCount++;
						}

					}
					//check for madatory select option
				} else if ($(this).is("select")) {
					if ($(this).find(":selected").text() === "" || $(this).find(":selected").text() === "Please Select") {
						if ($(this).siblings('label.tab-error').length === 0) {
							$(this).after('<label class="tab-error"></label>')
							$(".tab-error").css(tabErrorStyle);
							$(this).next(".tab-error").text("Please fill this field");
							return false;
						} else {
							return false;
						}
					} else {
						//remove validation error if input is filled properly
						$(this).next(".tab-error").remove();
						if (filledElementMandatoryCount <= dataMandatoryLength) {
							filledElementMandatoryCount++;
						}
					}
					//check for madatory other fields like text, text area and calendar
				} else {
					if ($(this).val() === "") {
						if ($(this).siblings('label.tab-error').length === 0) {
							$(this).after('<label class="tab-error"></label>')
							$(".tab-error").css(tabErrorStyle);
							$(this).next(".tab-error").text("Please fill this field");
							return false;
						} else {
							return false;
						}
					} else {
						//remove validation error if input is filled properly
						$(this).next(".tab-error").remove();
						if (filledElementMandatoryCount <= dataMandatoryLength) {
							filledElementMandatoryCount++;
						}
					}
				}

			}
		});

		//Check if all the mandatory elements all filled
		if (filledElementMandatoryCount === dataMandatoryLength) {

			//Take an empty array for storing skipped steps (optional steps)
			var ArrOfSkipOptions = [];

			//Loop through all the optional inputs and fill the skip list with unfilled inputs
			$('.tab-pane.active [data-myinput=optional-input]').each(function(index, element) {

				//check for optional radio button
				if ($(this).hasClass("radio-div")) {
					if ($(this).find(":checked").length === 0) {

						//If this fields is empty then push its label-text to the Array
						ArrOfSkipOptions.push($(this).prev("label").text());
					}
					//check for optional select option
				} else if ($(this).is("select")) {
					if ($(this).find(":selected").text() === "" || $(this).find(":selected").text() === "Please Select") {
						//If this fields is empty then push its label-text to the Array
						ArrOfSkipOptions.push($(this).prev("label").text());
					}
					//check for optional other fields like text, text area and calendar
				} else if ($(this).val() === "") {
					//If this fields is empty then push its label-text to the Array
					ArrOfSkipOptions.push($(this).prev("label").text());
				}

			});

			//Reverse the array do that pop element will be start from first instead of last element in the array
			var ArrSkipRev = ArrOfSkipOptions.reverse();

			//Pop all the array elements one by one
			if (ArrSkipRev.length > 0) {
				var r = 0;
				while (ArrSkipRev.length > 0) {
					r++;

					//Pop an element
					var popped_element = ArrSkipRev.pop();

					//Split the element to remove "colon" from it
					var popped_element_first_splitted_part = popped_element.split(":")[0];

					//append an empty skip-step-label in the skip step-card
					$(".steps-card").eq(tabPaneIndex).find(".card-body").append('<label class="skip-steps-label"></label>');

					//assign the value of popped array element to the skip-label
					$(".steps-card").eq(tabPaneIndex).find(".skip-steps-label").last().text(r + ') ' + popped_element_first_splitted_part);
				}

				//remove "display:none" property of the cuurent tab has atleast one skip-step-label in it
				if ($(".steps-card").eq(tabPaneIndex).hasClass("d-none")) {
					$(".steps-card").eq(tabPaneIndex).removeClass("d-none");
				}

				//If all the array popup of the current tab is done the go to the next tab
				goToNext();
			} else {

				//If there is no element in the array of the cuurent then make it display-none 
				if (!($(".steps-card").eq(tabPaneIndex).hasClass("d-none"))) {
					$(".steps-card").eq(tabPaneIndex).addClass("d-none");
				}

				//go to next tab
				goToNext();
			}

		}
	});

	//goToNext() function will check the next tab availablity and take the user to the next tab and increase the progress bar count
	function goToNext() {
		var next_tab = $('.nav-pills .nav-item .nav-link.active').closest('li').next().find('a');
		if (next_tab.length > 0) {
			next_tab.trigger('click');
		}

		//It will increase the progress bar count
		navIndex = $('.nav-link.active').index(".nav-link");
		$(".progress-bar").css("width", navIndex * 20 + "%");
		$(".progress-bar").text(navIndex * 20 + "%");

        //on every next/prev tab click , make it scroll to the top
        $(".steps-counter-div").animate({
			scrollTop: 0
		}, 500);
	}

	//on every next/prev tab click , make it scroll to the top
	$(".nav-link").click(function() {
		$(".tab-content").animate({
			scrollTop: 0
		}, 500);
	});

	var navIndex;
	//On Previous step button click take the user to the previous step
	$('.prev-btn').click(function(e) {
		e.preventDefault();
		//Check the previous link
		var prev_tab = $('.nav-pills .nav-item .nav-link.active').closest('li').prev().find('a');

		//Check if previous tab available
		if (prev_tab.length > 0) {
			prev_tab.trigger('click');
		}

		//Take the active nav index number and multiply it so that progress bar move according to it
		navIndex = $('.nav-link.active').index(".nav-link");
		$(".progress-bar").css("width", navIndex * 20 + "%");
		$(".progress-bar").text(navIndex * 20 + "%");

        //on every next/prev tab click , make it scroll to the top
        $(".steps-counter-div").animate({
			scrollTop: 0
		}, 500);
	});


	//Css for inputs validation style 
	var tabErrorStyle = {
		"font-size": "12px",
		"font-weight": "bold",
		"color": "red"
	};


	//This is an extra/optional jquery script for setting the particular radio button in the tab number 2. You can remove it if needed
	$('input[type=radio][name=physically-disabled-radio-button-name]').change(function() {
		if (this.value == 'Yes') {
			$("#handicap-select-input").prop('disabled', false);
			$("#handicap-select-input").attr("data-myinput", "optional-input");
		} else if (this.value == 'No') {
			$("#handicap-select-input").prop('disabled', true);
			$("#handicap-select-input").val("");
			$("#handicap-select-input").removeAttr("data-myinput");
		}
	});

});