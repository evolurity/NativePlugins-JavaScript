Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling)
}

$.modal = function (options) {

    const ANIMATION_SPEED = 200;
    let closing = false;
    let destroyed = false;
    const modal = {
        open() {
            if (!destroyed) {
                !closing && $modal.classList.add('open');
                onOpen();
            }
        },

        close() {
            closing = beforeClose();
            if (closing) {
                $modal.classList.remove('open');
                $modal.classList.add('hide');
                setTimeout(() => {
                    $modal.classList.remove('hide')
                    closing = false;
                }, ANIMATION_SPEED)
                onClose();
            }
        },

        destroy() {
            const modal = document.querySelector('.mymodal');
            document.body.removeEventListener('click', modal.close);
            modal.parentNode.removeChild(modal);
            destroyed = true;
        }
    }
    const $modal = _createModal(options);
    $modal.addEventListener('click', e => {
        if (e.target.dataset.close) {
            modal.close();
        }
    })

    function onClose() {
        if (options.onClose) {
            options.onClose()
        }
    }

    function onOpen() {
        if (options.onOpen) {
            options.onOpen()
        }
    }

    function beforeClose() {
        return confirm('You agree?');
    }

    function noop() {
    }

    function _createFooter(buttons) {
        if (buttons.length === 0) {
            return document.createElement('div');
        }
        const wrap = document.createElement('div');
        wrap.classList.add('modal-footer')
        buttons.forEach(btn => {
            const $btn = document.createElement('button');
            $btn.textContent = btn.text;
            $btn.classList.add('btn');
            $btn.classList.add(`btn-${btn.type || 'secondary'}`);
            $btn.onclick = btn.handler || noop;
            wrap.appendChild($btn);
        })
        return wrap
    }

    function _createModal(options) {
        const defaultWidth = '600px';
        const modal = document.createElement('div');
        const modalFooter = _createFooter(options.footerButtons);
        modal.classList.add('mymodal');
        modal.insertAdjacentHTML('afterbegin', `
            <div class="modal-overlay" data-close="true">
                    <div class="modal-window" style="width: ${options.width || defaultWidth}">
                        <div class="modal-header">
                            <span class="modal-title">${options.title || 'Modal'}</span>
                            <span class="modal-close" data-close="true">${options.closable ? '&times;' : ''}</span>
                        </div>
                        <div class="modal-body" data-content>
                            <p>${options.content || ''}</p>
                        </div>
                    </div>
                </div>
        `);
        document.body.appendChild(modal);
        modalFooter.appendAfter(modal.querySelector('[data-content]'))
        return modal;
    }

    return Object.assign(modal, {
        setContent: (html) => $modal.querySelector('[data-content]').innerHTML = html
    })

}
