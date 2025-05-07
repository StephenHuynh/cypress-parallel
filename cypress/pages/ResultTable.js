import { CommonElements } from "../pages/CommonElements";
const commonElements = new CommonElements();
export class ResultTable {
	// Result Table Section
	resultTableSection = {
		selector: "section[class='search-results-table']",

		tableSection: {
			selector: "table[class^='table table-hover']",
			headerSelector: "table[class^='table table-hover'] thead tr th",
			rowSelector: "tbody tr[role='row']",
			cellSelector: "td",
			buttonSelector: "button[type='button']",
		},
		editButtonSelector: "button[title='Table Settings']",
	};

	cvProfileBtn = "button[title='CView Profile']";
	viewBtn = "button[title='View']";
	contextMenuContainerSelector = "nv-context-menu-container";
	hoverOverCopyIdBtn = "nv-button[icon*='fa-copy']";
	hoverOverCopyLinkBtn = "nv-button[icon*='fa-link']";
	paginationSelector = "ul.pagination";
	pageButtonSelector = "li.paginate_button.page-item > a";

	headerVerticalTable = "ul > li > span[class*='title']";

	clickEditColumns() {
		cy.get(this.resultTableSection.selector).should("be.visible").within(() => {
			cy.intercept('GET', '**?plugin=GetUserConfig*').as('getUserConfig');
			cy.intercept('GET', '**?plugin=SearchSharedUserConfig*').as('searchSharedUserConfig');
			cy.get(this.resultTableSection.editButtonSelector).click();
			cy.wait('@getUserConfig').its('response.statusCode').should('eq', 200);
			cy.wait('@searchSharedUserConfig').its('response.statusCode').should('eq', 200);
		});
	}

	clickButton(label) {
		let { tableSection } = this.resultTableSection;
		cy.get(this.resultTableSection.selector).should("be.visible").within(() => {
			cy.get(tableSection.buttonSelector).find("span").contains(label).click();
		});
		cy.wait(500);
	}

	getTableHeaders() {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).last().scrollIntoView();
		cy.get(`${tableSection.headerSelector}:visible`)
			.then(($headers) => {
				return (
					Cypress.$.makeArray($headers)
						// and extract inner text from each
						.map((el) => el.innerText)
				);
			})
			.then((array) => {
				console.log(array);
				return array;
			});
	}

	getHeaders() {
		const list = [];
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.get("thead > tr > th:visible").each((header) => {
				list.push(header.text());
			});
		});
		cy.log(list);
	}

	verifyHeaderExisted(header) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).last().scrollIntoView();
		cy.get(`${tableSection.headerSelector}:visible`)
			.then(($headers) => {
				return (
					Cypress.$.makeArray($headers)
						// and extract inner text from each
						.map((el) => el.innerText)
				);
			})
			.then((array) => {
				expect(array.includes(header.toUpperCase()), `Header: ${header.toUpperCase()} is existed!`).equal(true);
			});
	}

	verifyHeaderNotExisted(header) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).last().scrollIntoView();
		cy.get(`${tableSection.headerSelector}:visible`)
			.then(($headers) => {
				return (
					Cypress.$.makeArray($headers)
						// and extract inner text from each
						.map((el) => el.innerText)
				);
			})
			.then((array) => {
				expect(!array.includes(header.toUpperCase()), `Header: ${header.toUpperCase()} is NOT existed!`).equal(true);
			});
	}

	waitForResultTableLoaded() {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).last().then(() => {
			cy.get("tbody > tr > td").invoke("text").then((text) => {
				if (text.includes("Loading")) {
					cy.log(`Waiting for table loaded!!!!`);
					cy.wait(500);
					this.waitForResultTableLoaded();
				}
			});
		});
	}

	// For Action column only has View
	viewSpecificRow(text) {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			// cy.get("tbody tr > td > span").contains(text).parents("[role='row']")
			cy.get("tbody tr > td > span").contains(text, { matchCase: false }).parents(tableSection.rowSelector)
				.within(() => {
					cy.get(commonElements.contextMenu)
						.find(this.resultTableSection.tableSection.buttonSelector)
						.click()
						.wait(500);
				});
		});
		cy.waitForPageLoaded();
	}

	// For Action column only has Remove icon
	removeSpecificRow(text) {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			// cy.get("tbody tr > td > span").contains(text).parents("[role='row']")
			cy.get("tbody tr > td > span").contains(text, { matchCase: false }).parents(tableSection.rowSelector)
				.within(() => {
					cy.get(commonElements.contextMenu)
						.find(this.resultTableSection.tableSection.buttonSelector)
						.click()
						.wait(500);
				});
		});
		cy.confirmDialog();
		cy.waitForPageLoaded();
	}

	openActionMenu(rowValue, tableSelector) {
		// let { tableSection } = this.resultTableSection;
		tableSelector = tableSelector || this.resultTableSection.tableSection['selector'];
		this.waitForResultTableLoaded();
		cy.get(`${tableSelector}:visible`).last().within(() => {
			cy.get("tbody tr > td > span").contains(rowValue, { matchCase: false })
				.parents(this.resultTableSection.tableSection.rowSelector)
				.within(() => {
					cy.get(commonElements.contextMenu)
						.find(this.resultTableSection.tableSection.buttonSelector)
						.click({force: true}).wait(500);
				});
		});
	}

	/**
	 * @description click the first row on first column (usually ID with Hyperlink) from result table
	 */
	clickFirstRowInResultTable() {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			let tableContent = table.find("tbody tr > td").text().trim();
			if (!tableContent.startsWith("No data available in table") || !tableContent.includes("No matching records found")) {
				cy.get(tableSection.rowSelector).find("td:visible").then(($rowElement) => {
					cy.log("Click on the first record in Result Table!");
					cy.wrap($rowElement.find("a:visible").first().css("background-color", "red")).click({force: true});
				});
			} else {
				throw new Error("No data available in table");
			}
		});
		cy.wait(2000);
		cy.waitForPageLoaded();
		cy.waitForPopUpDisappeared();
	}

	viewLegalPersonByName(text) {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			cy.get("tbody tr > td > span").contains(text, { matchCase: false }).parents(tableSection.rowSelector)
				.then((row) => {
					row.find(`${this.viewBtn}:visible`).click();
				});
		});
		cy.waitForPageLoaded();
		cy.wait(1000);
	}

	viewLegalPersonCViewByName(text) {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			cy.get("tbody tr > td > span").contains(text).parents(tableSection.rowSelector)
				.then((row) => {
					cy.wrap(row).get(this.cvProfileBtn).first().click();
					cy.wait(1000);
				});
		});
		cy.waitForPageLoaded();
	}

	viewSpecificRowInResultTable(text) {
		this.openActionMenu(text);
		cy.get(`${commonElements.nvContextMenuContainer}:visible`).within(() => {
			cy.get("li a:contains('View'):visible").click();
			cy.wait(1000);
		});
		cy.waitForPopUpDisappeared();
	}

	deleteSpecificRowInResultTable(text) {
		this.openActionMenu(text);
		cy.get(`${this.contextMenuContainerSelector}:visible`).contains("Delete")
			.click({ force: true });
		cy.wait(1000);
		cy.confirmDialog();
	}

	revokeSpecificRowInResultTable(text) {
		this.openActionMenu(text);
		cy.get(`${this.contextMenuContainerSelector}:visible`).contains("Revoke").click();
		cy.confirmDialog();
	}

	/**
	 * @description used to click on ACTION column and Perform specific actions which are not in View, Delete, Revoke 
	 * @param {String} headerName - Header Name of Table
	 * @param {String} value - input value for all rows
	 */
	performSpecificActionInResultTable(rowValue, action, tableSelector) {
		tableSelector = tableSelector || this.resultTableSection.tableSection['selector'];
		this.openActionMenu(rowValue, tableSelector);
		cy.get(`${commonElements.nvContextMenuContainer}:visible`).within(() => {
			cy.get("li a:visible").contains(new RegExp("^" + action + "$", "g")).click();
		});
		cy.wait(1000);
		if (action.toLowerCase() !== "change info" &&
			action.toLowerCase() !== "product summary" &&
			action.toLowerCase() !== "edit" &&
			action.toLowerCase() !== "view map" &&
			action.toLowerCase() !== "view" &&
			action.toLowerCase() !== "summary" &&
			action.toLowerCase() !== "copy" &&
			action.toLowerCase() !== "renew to offer" &&
			action.toLowerCase() !== "clone" &&
			action.toLowerCase() !== "publish"
		) {
			cy.confirmDialog();
		}
		cy.waitForPageLoaded();
	}

	verifyNoRecordsInResultTable() {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).wait(1000).last().within((table) => {
			let txt = table.find("tbody tr > td").text();
			assert.isTrue((txt.includes("No data available in table") || txt.includes("No matching records found"))
				, "There are no records found!");
		});
	}

	verifyResultsReturned() {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).last().within((table) => {
			let rows = table.find("tbody > tr:visible").length;
			(rows === 1 && table.find("tbody > tr td").length === 1) ?
				assert.fail("There are no records found!")
				: assert.isTrue(rows >= 1, `There are ${rows} records found!`);
		});
	}

	verifyRowCrossedOverInTable() {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.wait(1000);
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			let rowAttribute = table.find("tbody > tr").attr("class");
			assert.isTrue(
				rowAttribute.includes("decoration-line-through"),
				"The value is striked-through");
		});
	}

	verifyRowNotCrossedOverInTable() {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.wait(1000);
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			let rowAttribute = table.find("tbody > tr").attr("class");
			expect(rowAttribute).to.not.include("decoration-line-through");
		});
	}

	/**
	 * @description Verify ALL Row's Value (Text) based on Colum Header in Table
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of all Rows
	 */
	verifyAllRowsBasedOnColumHeader(columnHeader, searchText) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).then((table) => {
			const visibleTables = Cypress.$.makeArray(table).filter((el) => el.checkVisibility());
			if (visibleTables.length > 1) {
				return visibleTables[length - 1];
			} else {
				return visibleTables;
			}
		}).within((visibleTable) => {
			console.log("Visible table: ", visibleTable);
			cy.get("thead").scrollIntoView().contains("th:visible", new RegExp("^" + columnHeader + "$", "g"), { matchCase: false })
				.invoke("index").then((index) => {
					cy.get("tbody > tr:visible").each(($element) => {
						cy.wrap($element).within(() => {
							cy.get("td").eq(index).then(($cell) => {
								$cell.find("span").css("color", "red");
								let text = $cell.text().trim().toUpperCase();
								expect(text.replaceAll(" ", ""), 
									`${searchText.toUpperCase()} is found under Column: ${columnHeader.toUpperCase()}`)
									.to.contain(searchText.toUpperCase().replaceAll(" ", ""));
							});
						});
					});
				});
		});
	}

	/**
	 * @description Verify Row's Value (Text) (at least 1 row) based on Colum Header in Table
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of Row
	 * @param {String} tableSelector - CSS or Xpath Selector of Table Element
	 */
	verifyRowBasedOnColumHeader(columnHeader, searchText, tableSelector) {
		tableSelector = tableSelector || this.resultTableSection.tableSection['selector'];
		cy.get(`${tableSelector}`).then((table) => {
			const visibleTables = Cypress.$.makeArray(table).filter((el) => el.checkVisibility());
			if (visibleTables.length > 1) {
				return visibleTables[length - 1];
			} else {
				return visibleTables;
			}
		}).within(() => {
			cy.get("thead").scrollIntoView().contains("th", new RegExp("^" + columnHeader + "$", "g"), { matchCase: false })
				.invoke("index").then((index) => {
					cy.get("tbody > tr").then($rowElement => {
						var trigger = false;
						const noOfRows = $rowElement.length;
						for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
							// console.log(`Index: ${nthRow}`);
							var text = "";
							const $td = $rowElement.get(nthRow).getElementsByTagName("td")
								.item(index);
							if ($td.childElementCount > 0) {
								const $span = $td.querySelector("span");
								text = $span.innerText;
							} else {
								text = $td.innerText;
							}
							if (text.toLowerCase().endsWith(searchText.toLowerCase())) {
								$td.style.backgroundColor = "red";
								trigger = true;
							}
						}
						expect(trigger, 
							`The value ${searchText.toUpperCase()} is displayed under Column: ${columnHeader.toUpperCase()}`
						).to.be.true;
					});
				});
		});
	}

	/**
	 * @description Click Row's Value (Text) based on Colum Header and Value of Row in Table
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of Row, if not specify will click on first row
	 */
	clickOnRowBasedOn(columnHeader, searchText) {
		searchText = searchText || "";
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).then((table) => {
			const visibleTables = Cypress.$.makeArray(table).filter((el) => el.checkVisibility());
			if (visibleTables.length > 1) {
				return visibleTables[length - 1];
			} else {
				return visibleTables;
			}
		}).within(() => {
			cy.get("thead").scrollIntoView()
				.contains("th:visible", new RegExp("^" + columnHeader + "$", "g"), { matchCase: false }).invoke("index").then((index) => {
					cy.get("tbody > tr:visible").then($rowElement => {
						if (searchText === "" || searchText === undefined) {
							console.log("Go Here");
							const firstElement = $rowElement.get(0).getElementsByTagName("td").item(index).querySelector("span");
							// Click the first row of specified column
							firstElement.childElementCount === 0
								? firstElement.click()
								: firstElement.querySelector("a").click();

						} else {
							console.log(`Go Here with Specific Row: ${searchText}`);
							const noOfRows = $rowElement.length;
							for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
								// console.log(`Index: ${nthRow}`);
								const $tdEle = $rowElement.get(nthRow).getElementsByTagName("td").item(index);
								const $span = $tdEle.querySelector("span");
								const text = $span.innerText;
								if (text.toLowerCase().endsWith(searchText.toLowerCase())) {
									$span.style.backgroundColor = "red";
									$span.childElementCount === 0
										? $span.click()
										: $span.querySelector("a").click();
									// if ($span.hasChildNodes() === true) {
									// 	console.log("More child");
									// 	$span.querySelector("a").click();
									// } else {
									// 	console.log("No more child");
									// 	$span.click();
									// }
									return;
								}
							}
						}
					});
				});
		});
		cy.wait(1000);
	}

	/**
	 * Used to verify the Object Name (Multiple Version) in Result Table
	 * @param {String} headerName Column Header in Table
	 * @param {Array} searchText An array of object versions
	 */
	verifyMultipleObjectVersionsInResultTable(headerName, searchText) {
		if (searchText.length == 1) {
			this.verifyAllRowsBasedOnColumHeader(headerName, searchText[0]);
		} else {
			console.log("Object contains multiple versions");
			let { tableSection } = this.resultTableSection;
			cy.get(`${tableSection.selector}`).then((table) => {
				if (table.length > 1) {
					for (let index = 0; index < table.length; index++) {
						if (!table.get(index).hidden) {
							return table.get(index);
						}
					}
				}
			}).within((visibleTable) => {
				console.log("Visible table: ", visibleTable);
				cy.get("thead").scrollIntoView()
					.contains("th:visible", new RegExp("^" + headerName + "$", "g"), { matchCase: false }).invoke("index").then((index) => {
						cy.get("tbody > tr:visible").each(($element) => {
							cy.wrap($element).within(() => {
								cy.get("td").eq(index).then(($cell) => {
									let text = $cell.children("span").text().trim().toLowerCase();
									var trigger = false;
									for (let indexSearch = 0; indexSearch < searchText.length; indexSearch++) {
										var searchTextVersion = searchText[indexSearch].toLowerCase();
										if (text.includes(searchTextVersion)) {
											trigger = true;
											return false;
										}
									}
									assert.isTrue((trigger),
										`${searchText} is found under Column: ${headerName.toUpperCase()}`);
								});
							});
						});
					});
			});
		}
	}

	/**
	 * @description inputValuesInTable  is used to input for all rows based on Header Column
	 * @param {String} headerName - Header Name of Table
	 * @param {String} value - input value for all rows
	 */
	inputValuesInTable(headerName, value) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.get("thead").contains("th", headerName, { matchCase: false }).invoke("index")
				.then((index) => {
					cy.get("tbody > tr:visible").each(($element) => {
						cy.wrap($element).within(() => {
							cy.get("td").eq(index).then(($cell) => {
								cy.wrap($cell).find("input:visible").type(value);
							});
						});
					});
				});
		});
	}

	/**
	 * @description inputValueForLastRowInTable is used to input for LAST ROW based on Header Column
	 * @param {String} headerName - Header Name of Table
	 * @param {String} value - input value for all rows
	 */
	inputValueForLastRowInTable(headerName, value) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).then(() => {
			cy.get("thead").contains("th", headerName, { matchCase: false }).invoke("index")
				.then((index) => {
					cy.get("tbody > tr:visible").last().then(($element) => {
						cy.wrap($element).find("td").eq(index)
							.then(($cell) => {
								cy.wrap($cell).find("input").clear().type(value);
							});
					});
				});
		});
	}

	/**
	 * @description inputValueForFirstRowInTable is used to input for FIRST ROW based on Header Column
	 * @param {String} headerName - Header Name of Table
	 * @param {String} value - input value for all rows
	 */
	inputValueForFirstRowInTable(headerName, value) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}`).then(() => {
			cy.get("thead").contains("th", headerName, { matchCase: false })
				.invoke("index").then((index) => {
					cy.get("tbody > tr:visible").first()
						.then(($element) => {
							if ($element.text().includes("Loading ...")) {
								cy.wait(1000);
								this.inputValueForFirstRowInTable(headerName, value);
							} else {
								cy.wrap($element).find("td").eq(index)
									.then(($cell) => {
										cy.wrap($cell).find("input").clear().type(value);
									});
							}
						});
				});
		});
	}

	/*
		Use for verifying the attribute Title based on specific column header (Non-Text value)
	*/
	verifyNonTextColumnInResultTable(fieldLabel, searchText) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.get("thead").contains("th", fieldLabel, { matchCase: false }).invoke("index")
				.then((index) => {
					cy.get("tbody > tr").each(($element) => {
						cy.wrap($element).within(() => {
							cy.get("td").eq(index).then(($cell) => {
								cy.wrap($cell).find("span i").invoke("attr", "title")
									.then((text) => text.toLowerCase())
									.should("contain", searchText.toLowerCase());
							});
						});
					});
				});
		});
	}

	/*
		Verify Claim Status in Claim Page
	*/
	verifyClaimStatusInTable(fieldLabel, searchText) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.get("thead").contains("th", fieldLabel, { matchCase: false }).invoke("index")
				.then((index) => {
					cy.get("tbody > tr").each(($element) => {
						cy.wrap($element).within(() => {
							cy.get("td").eq(index).then(($cell) => {
								cy.wrap($cell).find("bo-claim-status label").invoke("text")
									.then((text) => text.toLowerCase().trim())
									.should("contain", searchText.toLowerCase());
							});
						});
					});
				});
		});
	}

	/*
		Use for verifying the SEARCH_VALUE on specific Column based on specific Row 
	*/
	/**
	 * @description Verify Specific Row's value (Title of icon/pic) based on Colum Header and Row Value of its Header in Table
	 * @param {String} sourceHeader - Column Header
	 * @param {String} sourceValue - Value of Row on sourceHeader
	 * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
	 * @param {String} searchValue - Row's value (Title of icon/pic) need to verify on Target Column and Target Row
	 */
	verifyNonTextRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.getRowIndexBy(sourceHeader, sourceValue).then(rowIndex => {
				cy.get("thead").contains("th:visible", searchHeader, { matchCase: false })
					.invoke("index").then(($destinationCol) => {
						cy.get("tbody > tr:visible").eq(rowIndex).then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").eq($destinationCol)
								.find("span i").invoke("attr", "title")
								.then((text) => text.toLowerCase())
								.should("contain", searchValue.toLowerCase());
						});
					});
			});
		});
	}

	verifyIconInRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.getRowIndexBy(sourceHeader, sourceValue).then(rowIndex => {
				cy.get("thead").contains("th:visible", searchHeader, { matchCase: false })
					.invoke("index").then(($destinationCol) => {
						cy.get("tbody > tr:visible").eq(rowIndex).then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").eq($destinationCol).find("i")
								.invoke('attr', 'style', 'background-color: red')
								.invoke("attr", "class")
								.then((text) => text.toLowerCase())
								.should("contain", searchValue.toLowerCase());
						});
					});
			});
		});
	}

	/**
	 * consider to change the function to verifyRowBasedOnColumHeaderAndRow()
	 * @description Verify Specific Row's Value (Text) based on Colum Header and Row Value of its Header in Table
	 * @param {String} sourceHeader - Column Header
	 * @param {String} sourceValue - Value of Row on sourceHeader
	 * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
	 * @param {String} searchValue - Row's value need to verify on Target Column and Target Row
	 */
	verifyRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue, tableSelector) {
		tableSelector = tableSelector || this.resultTableSection.tableSection['selector'];
		cy.get(`${tableSelector}:visible`).within(() => {
			cy.getRowIndexBy(sourceHeader, sourceValue).then(rowIndex => {
				cy.get("thead").contains("th:visible", searchHeader, { matchCase: false }).invoke("index").then(($destinationCol) => {
					cy.get("tbody > tr:visible").eq(rowIndex)
						.then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").eq($destinationCol).find("span").invoke("text")
								.then((text) => text.toLowerCase().trim())
								.should("contain", searchValue.toLowerCase());
						});
				});
			});
		});
	}

	/**
	 * @description Input Specific Row's Value (Text) based on Colum Header and Row Value of its Header in Table
	 * @param {String} sourceHeader - Column Header
	 * @param {String} sourceValue - Value of Row on sourceHeader
	 * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
	 * @param {String} value - Row's value need to verify on Target Column and Target Row
	 */
	inputRowValueBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, value) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.getRowIndexBy(sourceHeader, sourceValue).then(rowIndex => {
				cy.get("thead").contains("th:visible", searchHeader, { matchCase: false }).invoke("index")
					.then(($destinationCol) => {
						cy.get("tbody > tr:visible").eq(rowIndex).then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").eq($destinationCol).find("input").type(value).realPress("Tab");
						});
					});
			});
		});
	}

	checkCheckBoxBasedOnRowInTable(sourceHeader, sourceValue, checkBoxColumn) {
		checkBoxColumn = checkBoxColumn - 1 || 0;
		if (sourceValue === undefined && checkBoxColumn === undefined) {
			throw new Error("Missing sourceValue or checkBoxColumn value, please input the value!");
		}
		let { tableSection } = this.resultTableSection;
		let rowIndex = -1;
		cy.get(`${tableSection.selector}:visible`)
			.first().within(() => {
				cy.get("thead").contains("th", sourceHeader, { matchCase: false }).invoke("index")
					.then((sourceCol) => {
						cy.get("tbody > tr").then(($rowElement) => {
							for (let index = 0; index < $rowElement.length; index++) {
								const $td = $rowElement.get(index).getElementsByTagName("td").item(sourceCol);
								if ($td.innerText.toLowerCase().trim() === sourceValue.toLowerCase()) {
									rowIndex = index;
									return false;
								}
							}
						});
					});
				cy.get("thead").get(`th:eq(${checkBoxColumn}):visible`).invoke("index").then(colIndex => {
					cy.get("tbody > tr").eq(rowIndex)
						.then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").eq(colIndex).find("a").click();
						});
				});
			});
	}

	checkCheckBoxBasedOnVisibleColumn(columnHeader, rowValue, checkboxColumn) {
		checkboxColumn = (checkboxColumn - 1) || 0;
		if (rowValue === undefined) {
			throw new Error("Missing rowValue or checkBoxColumn value, please input the value!");
		}
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).first().within(() => {
			cy.getRowIndexBy(columnHeader, rowValue).then(index => {
				cy.get("tbody > tr").eq(index).find("td:visible")
					.eq(checkboxColumn).find(commonElements.nvCheckbox).check({ force: true });
			});
		});
	}

	/**
	 * @description click the only button on ROW based on Column Header and Row Value
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of Row
	 */
	clickButtonOnLastColumnBasedOn(colHeader, rowValue, action = "View") {
		let { tableSection } = this.resultTableSection;
		let rowIndex = 0;
		cy.get(`${tableSection.selector}:visible`).first().within((table) => {
			let tableContent = table.find("tbody tr td").first().text().trim();
			if (!tableContent.startsWith("No data available in table")) {
				cy.get("thead").contains("th", colHeader, { matchCase: false }).invoke("index")
					.then((sourceCol) => {
						cy.get("tbody > tr").then(($rowElement) => {
							for (let index = 0; index < $rowElement.length; index++) {
								console.log(`Index: ${index}`);
								const $span = $rowElement.get(index)
									.getElementsByTagName("td").item(sourceCol)
									.querySelector("span");
								const actualText = $span.textContent.trim();
								console.log(`actualText: ${actualText} and searchText: ${rowValue}`);
								if (actualText.toLowerCase() === rowValue.toLowerCase()) {
									// console.log(`Found the MATCH at index ${index}`);
									$span.style.backgroundColor = "red"
									rowIndex = index;
									return false;
								}
							}
						});
					});
				cy.get("thead").get("th:visible").last()
					.then(() => {
						cy.get("tbody > tr").eq(rowIndex).then(($destinationCell) => {
							cy.wrap($destinationCell).find("td").find("button").click();
						});
					});
				} else {
					throw new Error("No data available in table");
				}
		});
		cy.wait(1000);
		if (action !== "Select")
			cy.waitForPageLoaded();
	}

	clickFirstRowBasedOn(colHeader) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).first().within(() => {
			cy.get("thead").contains("th:visible", colHeader, { matchCase: false }).invoke("index")
				.then((sourceCol) => {
					cy.get("tbody > tr").first().then(($rowElement) => {
						cy.wrap($rowElement).find("td:visible").eq(sourceCol).find("a").click();
					});
				});

		});
		cy.wait(1000);
	}

	/**
	 * @description used to click on TEXT in Table from Dialog popUp
	 * @param {string} text 
	 */
	clickSpecificRow(text) {
		let { tableSection } = this.resultTableSection;
		this.waitForResultTableLoaded();
		cy.get(`${tableSection.selector}:visible`).within(() => {
			cy.get("tbody tr > td > span").contains(text).parents(tableSection.rowSelector)
				.then((row) => {
					cy.wrap(row).click();
				});
		});
		cy.waitForPageLoaded();
		cy.wait(1000);
	}

	removeSpecificRow(text) {
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).within((table) => {
			// cy.get("tbody tr > td > span").contains(text).parents("[role='row']")
			cy.get("tbody tr > td > span").contains(text).parents(tableSection.rowSelector)
				.within(() => {
					cy.get(commonElements.contextMenu)
						.find(this.resultTableSection.tableSection.buttonSelector)
						.click()
						.wait(500);
				});
		});
		cy.confirmDialog();
		cy.waitForPageLoaded();
	}

	deleteAttachmentsIfAny() {
		let { tableSection } = this.resultTableSection;
		cy.wait(1000);
		cy.get(`${tableSection.selector}:visible`).then(table => {
			let tableContent = table.find("tbody tr td").first().text().trim();
			if (!tableContent.startsWith("No data available in table")) {
				let noOfRows = table.find("tbody tr").length;
				for (let index = 1; index <= noOfRows; index++) {
					let row = noOfRows - index;
					// cy.log(`Index: ${row}`);
					cy.get("tbody tr").eq(row).find("context-menu button").click();
					cy.wait(1000);
					cy.get(`${this.contextMenuContainerSelector}:visible`).contains("Cancel").click({ force: true });
					cy.wait(1000);
					cy.confirmDialog();
					cy.wait(500);
					cy.log("Waiting for PopUp disappeared");
					cy.waitForPopUpDisappeared();
					// cy.waitForPageLoaded();
				}
			}
		});
	}

	/**
	 * @description used to row all rows available in Table which has only "Remove" icon in Action column
	 */
	removeRowsIfAny() {
		let { tableSection } = this.resultTableSection;
		cy.wait(1000);
		cy.log("removeRowsIfAny");
		cy.get(`${tableSection.selector}:visible`).then(table => {
			let tableContent = table.find("tbody tr td").first().text().trim();
			if (!tableContent.startsWith("No data available in table")) {
				let noOfRows = table.find("tbody tr").length;
				for (let index = 1; index <= noOfRows; index++) {
					let row = noOfRows - index;
					cy.get("tbody tr").eq(row).find("context-menu button").click();
					cy.wait(1000);
					cy.confirmDialog();
					cy.wait(1000);
					cy.waitForPageLoaded();
				}
			}
		});
	}

	/**
	 * @description used to delete a row available in Table
	 */
	deleteRowIfAny() {
		let { tableSection } = this.resultTableSection;
		cy.wait(1000);
		cy.get(`${tableSection.selector}:visible`).then(table => {
			let tableContent = table.find("tbody tr td").first().text().trim();
			if (!tableContent.startsWith("No data available in table")) {
				let noOfRows = table.find("tbody tr").length;
				for (let index = 1; index <= noOfRows; index++) {
					let row = noOfRows - index;
					// cy.log(`Index: ${row}`);
					cy.get("tbody tr").eq(row).find("context-menu button").click();
					cy.wait(1000);
					cy.get(`${this.contextMenuContainerSelector}:visible`).contains("Delete").click({ force: true });
					cy.wait(1000);
					cy.confirmDialog();
					cy.wait(500);
					cy.log("Waiting for PopUp disappeared");
					cy.waitForPopUpDisappeared();
				}
			}
		});
	}

	getItemIdFromTable(id) {
		let { tableSection } = this.resultTableSection;
		cy.get(this.resultTableSection.selector).within(table => {
			let td = table.find(tableSection.rowSelector).find(`td:visible:contains('${id}')`).get(0);
			td.setAttribute("id", "itemIdFromTable");
		});
		cy.get("#itemIdFromTable").realHover();
		cy.wait(200);
		cy.get(this.hoverOverCopyLinkBtn).click().wait(600);
		cy.window().its('navigator.clipboard').invoke('readText').then(txt => console.log(txt));
	}

	goToLastPageOfDatatable() {
		cy.get(this.pageButtonSelector).then((buttons) => {
			const numberOfButtons = buttons.length;
			cy.wrap(buttons).eq(numberOfButtons-2).click();
			cy.waitForPageLoaded();
		})
		
	}

	/**
	 * @description Verify Row's Value (Text) (at least 1 row) based on Colum Header in Table
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of Row
	 * @param {String} tableSelector - CSS or Xpath Selector of Table Element
	 */
	verifyValueFromVerticalTable(header, searchText = "") {
		cy.get(this.resultTableSection.tableSection['selector']).within(() => {
			cy.get(this.headerVerticalTable).contains(new RegExp("^" + header + "$", "g"), { matchCase: false })
				.then((headerNode) => {
					let dataNode = headerNode.next("span[class*='data']").text();
					expect(dataNode.toUpperCase()).to.contain(searchText.toUpperCase())
			});
		});
	}

	clickBasedOnVisibleColumn(columnHeader, rowValue, clickableColumn) {
		clickableColumn = (clickableColumn - 1) || 0;
		if (rowValue === undefined) {
			throw new Error("Missing rowValue or checkBoxColumn value, please input the value!");
		}
		let { tableSection } = this.resultTableSection;
		cy.get(`${tableSection.selector}:visible`).first().within(() => {
			cy.getRowIndexBy(columnHeader, rowValue).then(index => {
				cy.get("tbody > tr").eq(index).find("td:visible")
					.eq(clickableColumn).click().wait(500);
			});
		});
	}
}