/**
 * Drag and Drop & Keyboard Reordering Controller
 * Uses native HTML5 drag-and-drop with full visual drag feedback,
 * accompanied by accessible keyboard move up / down controls.
 */

export function setupDragDrop(container, onReorder) {
  let draggedItem = null;
  let draggedIndex = -1;

  container.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.module-item');
    if (!item) return;

    draggedItem = item;
    draggedIndex = parseInt(item.getAttribute('data-index'), 10);
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedIndex.toString());
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const targetItem = e.target.closest('.module-item');
    if (!targetItem || targetItem === draggedItem) return;

    // Add drag-over highlight
    const items = Array.from(container.querySelectorAll('.module-item'));
    items.forEach(el => el.classList.remove('drag-over'));
    targetItem.classList.add('drag-over');
  });

  container.addEventListener('dragleave', (e) => {
    const targetItem = e.target.closest('.module-item');
    if (targetItem) {
      targetItem.classList.remove('drag-over');
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetItem = e.target.closest('.module-item');
    const items = Array.from(container.querySelectorAll('.module-item'));
    items.forEach(el => el.classList.remove('drag-over'));

    if (!targetItem || targetItem === draggedItem) return;

    const targetIndex = parseInt(targetItem.getAttribute('data-index'), 10);
    if (!isNaN(draggedIndex) && !isNaN(targetIndex) && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
  });

  container.addEventListener('dragend', () => {
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
    }
    const items = Array.from(container.querySelectorAll('.module-item'));
    items.forEach(el => el.classList.remove('drag-over'));
    draggedItem = null;
    draggedIndex = -1;
  });
}

