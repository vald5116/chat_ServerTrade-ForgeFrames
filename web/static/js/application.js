let browserData = {}
const subscribeHeaders = {};
const centrifuge = new Centrifuge('wss://chat_servertrade-forgeframesws.vald5116.dev/connection/websocket', { subscribeEndpoint: "/api/centrifuge/subscribe", subscribeHeaders });
$(document).ready(function () {

	config.backend.token = '123456789';
	helper.inquiry({ url: config.backend.url + '/user' }, (data) => {
		if(data.user){
			$('#log ul').append(`<li>Users: auth</li>`)
			centrifugo(data.user)
		} else $('#log ul').append(`<li>Users: no auth</li>`)
	})
})

let
	tickets = {
		get: () => {
			window.location.hash = 'tickets';
			menuActiv()
			helper.inquiry({ url: config.backend.url + '/my/tickets' }, (data) => {
				if (data) {
					tickets.render(data)
				}

			})
		},
		render: (tickets) => {
			$('main.content').html(`<div class="container-fluid p-0">

					<div class="mb-3">
						<h1 class="h3 d-inline align-middle">Поддержка</h1>
					</div>

					<div class="card">
						<div class="row g-0">
							<div class="col-12 border-end" id="listTiketBlock">

								<div class="px-4">
									<div class="d-flex align-items-center">
										<div class="flex-grow-1">
											<div class="input-group">
												<input type="text" class="form-control my-3" id="newtiket" placeholder="Название нового тикета">
												<button class="btn btn-secondary my-3" type="button" onclick="tickets.newtiket()">Создать</button>
											</div>
										</div>
									</div>
								</div>
								<span id="ticketList" style="height: 547px;display: block;overflow-y: scroll;">
								</span>

								<hr class="d-block d-lg-none mt-1 mb-0">
							</div>
							<div class="col-12 col-lg-7 col-xl-9" id="NameIconBlock" style="display: none;">
								<div class="py-2 px-4 border-bottom" >
									<div class="d-flex align-items-center py-1">
									<div class="d-block d-lg-none me-3"><button class="btn border px-3 btn-outline-secondary" onclick="tickets.get()" title="Открыть тикет"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left align-middle"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button></div>
										<div class="flex-grow-1 ps-3">
											<strong id="nameTiket"></strong>
										</div>
									</div>
								</div>

								<div class="position-relative">
									<div class="chat-messages p-4" id="chatsLive" >

									</div>
								</div>

								<div class="flex-grow-0 py-3 px-4 border-top">
									<div class="input-group">
										<textarea type="text" class="form-control" id="msgInput" rows="1" placeholder="Напишите сообщение..."></textarea>
										<button class="btn btn-primary" id="sendMsgBtn">Отправить</button>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>`)
			$('main.content #ticketList').html(``)
			let l = 0;
			if (tickets.length) {
				tickets.map((a) => {
					let status = `<div id="status" class="badge bg-danger float-end">Закрыт</div>`
					if (a.status == 0) status = `<div id="status" class="badge bg-success float-end">Открыт</div>`
					else if (a.status == 1) status = `<div id="status" class="badge bg-danger float-end">Закрыт</div>`
					else if (a.status == 2) status = `<div id="status" class="badge bg-success float-end">В работе</div>`
					else if (a.status == 3) status = `<div id="status" class="badge bg-danger float-end">На контроле</div>`
					else if (a.status == 4) status = `<div id="status" class="badge bg-warning text-dark float-end">Ожидание</div>`
					else if (a.status == 5) status = `<div id="status" class="badge bg-info text-dark float-end">У руководства</div>`
					else if (a.status == 6) status = `<div id="status" class="badge bg-primary float-end">Финансовый отдел</div>`
					else if (a.status == 7) status = `<div id="status" class="badge bg-danger float-end">Отдел жалоб</div>`
					else if (a.status == 8) status = `<div id="status" class="badge bg-info text-dark float-end">Отдел продаж</div>`
					else if (a.status == 9) status = `<div id="status" class="badge bg-secondary float-end">В работе у инженера</div>`
					let calsstatus = 'list-group-item-light';
					if (l % 2 == 0) calsstatus = 'list-group-item-action';
					$('main.content #ticketList').append(`<a href="javascript:void(0)" onclick="tickets.chats(${a.id}, '${a.name}')" id="tikets_${a.id}" class="list-group-item ${calsstatus}">
    														${status}
															<div class="d-flex align-items-start">
																<div class="flex-grow-1 ms-3">
																	<span class="badge bg-secondary">#${a.id}</span> ${a.name}
																</div>
															</div>
														</a>`)
					l++;
				})
			}

			$("main.content #msgInput").keydown((event) => {
				// console.log(event)
				$('main.content #msgInput').height(0)
				$('main.content #msgInput').height($('main.content #msgInput').prop('scrollHeight') + 12)
				if (event.shiftKey && event.keyCode === 13) {
					// console.log('Нажато сочетание клавишь')
				} else if (event.keyCode === 13) {
					event.preventDefault();
					$("#sendMsgBtn").click();
				}
			});

			$("#sendMsgBtn").click(function () {
				let messages = $('main.content #msgInput').val().trim();
				if (messages.length != 0) {
					let ticketId = $('main.content #chatsLive').data("ticketId");
					helper.inquiry({ url: config.backend.url + '/new/messages', type: 'POST', data: { messages, ticketId } }, (data) => {
						$('main.content #msgInput').height(0).val("");
					})
				}
			});
		},
		chats: (ticketId, name) => {
			$(`main.content #nameTiket`).text(name);
			helper.inquiry({ url: config.backend.url + '/messages', type: 'POST', data: { ticketId } }, (data) => {
				if (data) {

					$('main.content #listTiketBlock').addClass("col-lg-5 col-xl-3 d-none d-lg-block");
					$('main.content #NameIconBlock').show();

					$('main.content #chatsLive').html('').data("ticketId", ticketId);
					tickets.chatsLiveConnect(ticketId)
					data.map((m) => {
						let classMsg = `chat-message-right`, userNameMsg = `<div class="font-weight-bold mb-1">You</div>`, ClassMsgL = `me-3`, styleTime = `text-align: end;`;
						userNameMsg = ``
						if (m.userId != config.backend.user.id) {
							classMsg = `chat-message-left`;
							userNameMsg = `<div class="font-weight-bold mb-1">${m.userId}</div>`;
							userNameMsg = ``;
							ClassMsgL = `ms-3`;
							styleTime = `text-align: start;`;
						}
						$('main.content #chatsLive').prepend(`<div class="${classMsg} mb-4" id="ChatMsg_${m.id}">
																	<!--div>
																		<img src="img/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
																		<div class="text-muted small text-nowrap mt-2" title="${timeConverter(m.createdAt)}">${timeConverterToChat(m.createdAt)}</div>
																	</div-->
																	<div class="flex-shrink-1 bg-light rounded py-2 px-3 ${ClassMsgL}">
																		${userNameMsg}
																		<span class="text-break" style="white-space: pre-wrap;"></span>
																		<div style="${styleTime}" class="text-muted small text-nowrap mt-2" title="${timeConverter(m.createdAt)}">${timeConverterToChat(m.createdAt)}</div>
																	</div>
																</div>`).scrollTop($('main.content #chatsLive').prop('scrollHeight'));
						$(`main.content #chatsLive #ChatMsg_${m.id} div.flex-shrink-1 span`).text(m.messages);
					})
				}
			})
		},
		chatsLiveConnect: (ticketId) => {
			Object.keys(centrifuge._subs).map((a) => {
				if (a.split('_')[0] == '$ticket') centrifuge._unsubscribe({ "channel": a });
			})

			centrifuge.subscribe(`$ticket_${ticketId}`, function (message) {
				if (window.location.hash == '#tickets') {
					switch (message.data.status) {
						case "new":
							let m = message.data.date;
							let classMsg = `chat-message-right`, userNameMsg = `<div class="font-weight-bold mb-1">You</div>`, ClassMsgL = `me-3`, styleTime = `text-align: end;`;
							userNameMsg = ``
							if (m.userId != config.backend.user.id) {
								classMsg = `chat-message-left`;
								userNameMsg = `<div class="font-weight-bold mb-1">${m.userId}</div>`;
								userNameMsg = ``;
								ClassMsgL = `ms-3`;
								styleTime = `text-align: start;`;
							}
							$('main.content #chatsLive').append(`<div class="${classMsg} mb-4" id="ChatMsg_${m.id}">
																	<!--div>
																		<img src="img/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
																		<div class="text-muted small text-nowrap mt-2" title="${timeConverter(m.createdAt)}">${timeConverterToChat(m.createdAt)}</div>
																	</div-->
																	<div class="flex-shrink-1 bg-light rounded py-2 px-3 ${ClassMsgL}">
																		${userNameMsg}
																		<span class="text-break" style="white-space: pre-wrap;"></span>
																		<div style="${styleTime}" class="text-muted small text-nowrap mt-2" title="${timeConverter(m.createdAt)}">${timeConverterToChat(m.createdAt)}</div>
																	</div>
																</div>`).scrollTop($('main.content #chatsLive').prop('scrollHeight'));
							$(`main.content #chatsLive #ChatMsg_${m.id} div.flex-shrink-1 span`).text(m.messages);
							break;
						default:
							console.log(message.data)
							break;
					}
				}
			})
		},
		newtiket: () => {
			let data = {}
			if ($("#newtiket").val().length != 0) {
				data.name = $("#newtiket").val();

				helper.inquiry({ url: config.backend.url + '/ticket', type: 'POST', data }, (data) => {
					tickets.get()
				})
			} else window.notyf.open({
				type: "warning",
				message: "Поле должно быть заполнено!",
				duration: 5000,
				dismissible: 1
			});
		},
		myticketscount: () => {
			helper.inquiry({ url: config.backend.url + '/my/tickets/count' }, (data) => {
				$(`#myticketsCount`).html(Number(data))
			})
		}
	};



function centrifugo(user) {
	if (config.backend.token) subscribeHeaders.Authorization = `Bearer ${config.backend.token}`;

	centrifuge.setToken(user.centrifugotoken);
	centrifuge.connect();

	centrifuge.subscribe(`chat`, function (message) {
		$('#log ul').append(`<li>#${message.data.date.id} User_${message.data.date.userId} Новое сообщение: ${message.data.date.messages} Время: ${timeConverter(message.data.date.date)}</li>`)
	})

	centrifuge.on('connect', function (context) { console.log('connect'); $('#log ul').append(`<li>centrifuge: connect</li>`)})
	centrifuge.on('disconnect', function (context) { console.log(context); $('#log ul').append(`<li>centrifuge: disconnect</li>`) });

}


function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var year = a.getFullYear();
	var month = ('0' + Number(a.getMonth() + 1)).slice(-2);
	var date = ('0' + a.getDate()).slice(-2);
	var hour = ('0' + a.getHours()).slice(-2);
	var min = ('0' + a.getMinutes()).slice(-2);
	var sec = ('0' + a.getSeconds()).slice(-2);
	var time = date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec;
	return time;
}