import { doMap } from '@a-ng-d/figmug.modules.do-map'
import { Button, Dropdown, Input } from '@a_ng_d/figmug-ui'
import React from 'react'

import { locals } from '../../content/locals'
import { Language, PlanStatus } from '../../types/app'
import { NoteConfiguration } from '../../types/configurations'
import features from '../../utils/config'
import Feature from './Feature'

interface NoteTypeItemProps {
  noteType: NoteConfiguration
  index: number
  selected: boolean
  guideAbove: boolean
  guideBelow: boolean
  planStatus: PlanStatus
  lang: Language
  onChangeNoteType: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> &
    React.MouseEventHandler &
    ((
      event:
        | React.MouseEvent<HTMLLIElement, MouseEvent>
        | React.KeyboardEvent<HTMLLIElement>
    ) => void)
  onChangeSelection: React.MouseEventHandler<HTMLLIElement>
  onCancellationSelection: React.MouseEventHandler<Element> &
    React.FocusEventHandler<HTMLInputElement>
  onDragChange: (
    id: string | undefined,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => void
  onDropOutside: (e: React.DragEvent<HTMLLIElement>) => void
  onChangeOrder: (e: React.DragEvent<HTMLLIElement>) => void
}

interface States {
  isDragged: boolean
  hasMoreOptions: boolean
}

export default class NoteTypeItem extends React.Component<
  NoteTypeItemProps,
  States
> {
  constructor(props: NoteTypeItemProps) {
    super(props)
    this.state = {
      isDragged: false,
      hasMoreOptions: false,
    }
  }

  // Handlers
  optionsHandler = () => {
    this.props.onCancellationSelection
    this.setState({ hasMoreOptions: !this.state.hasMoreOptions })
  }

  // Direct actions
  onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    this.setState({ isDragged: true })
    const clone = e.currentTarget.cloneNode(true)
    ;(clone as HTMLElement).style.opacity = '0'
    ;(clone as HTMLElement).id = 'ghost'
    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(clone as Element, 0, 0)
    e.dataTransfer.effectAllowed = 'move'
    document.querySelector('#ui')?.classList.add('dragged-ghost')
  }

  onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    this.setState({ isDragged: false })
    this.props.onDragChange('', false, false, 0)
    this.props.onDropOutside(e)
    document.querySelector('#ui')?.classList.remove('dragged-ghost')
    document.querySelector('#ghost')?.remove()
  }

  onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    const target = e.currentTarget,
      height: number = target.clientHeight,
      scrollY: number = (target.closest('.control__block') as HTMLElement)
        .scrollTop,
      refTop: number = target.offsetTop,
      refBottom: number = refTop + height,
      y: number = e.pageY + scrollY,
      refY: number = doMap(y, refTop, refBottom, 0, height)

    if (refY >= -1 && refY <= height / 2)
      this.props.onDragChange(
        target.dataset.id,
        true,
        false,
        parseFloat(target.dataset.position ?? '0')
      )
    else if (refY > height / 2 && refY <= height)
      this.props.onDragChange(
        target.dataset.id,
        false,
        true,
        parseFloat(target.dataset.position ?? '0')
      )
  }

  onDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    this.props.onChangeOrder(e)
  }

  // Render
  render() {
    return (
      <li
        data-id={this.props.noteType.id}
        data-position={this.props.index}
        className={[
          'list__item',
          this.state.isDragged ? 'list__item--dragged' : null,
          this.props.guideAbove ? 'list__item--above' : null,
          this.props.guideBelow ? 'list__item--below' : null,
          this.state.hasMoreOptions ? 'list__item--emphasis' : null,
        ]
          .filter((n) => n)
          .join(' ')}
        draggable={this.props.selected}
        onMouseDown={this.props.onChangeSelection}
        onDragStart={(e) => this.onDragStart(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e) => this.onDrop(e)}
      >
        <div className="list__item__primary">
          <div className="list__item__left-part">
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'SETTINGS_NOTE_TYPES_RENAME'
                )?.isActive
              }
            >
              <div className="list__item__param--compact">
                <Input
                  type="TEXT"
                  value={this.props.noteType.name}
                  charactersLimit={24}
                  feature="RENAME_NOTE_TYPE"
                  onFocus={this.props.onCancellationSelection}
                  onBlur={this.props.onChangeNoteType}
                  onConfirm={this.props.onChangeNoteType}
                />
              </div>
            </Feature>
            <Feature
              isActive={
                features.find(
                  (feature) =>
                    feature.name === 'SETTINGS_NOTE_TYPES_UPDATE_COLOR'
                )?.isActive
              }
            >
              <>
                <div className="list__item__param--square">
                  <div
                    style={{
                      width: 'var(--size-xsmall)',
                      height: 'var(--size-xsmall)',
                      borderRadius: '2px',
                      outline: '1px solid rgba(0, 0, 0, 0.1)',
                      outlineOffset: '-1px',
                      backgroundColor: this.props.noteType.hex,
                    }}
                  />
                </div>
                <div className="list__item__param--compact">
                  <Dropdown
                    id="update-note-type-color"
                    options={[
                      {
                        label: 'Gray',
                        value: 'GRAY',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 0,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Red',
                        value: 'RED',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 1,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Orange',
                        value: 'ORANGE',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 2,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Yellow',
                        value: 'YELLOW',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 3,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Green',
                        value: 'GREEN',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 4,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Blue',
                        value: 'BLUE',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 5,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Violet',
                        value: 'VIOLET',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 6,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Pink',
                        value: 'PINK',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 7,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                      {
                        label: 'Light gray',
                        value: 'LIGHT_GRAY',
                        feature: 'UPDATE_NOTE_TYPE_COLOR',
                        position: 8,
                        type: 'OPTION',
                        isActive: true,
                        isBlocked: false,
                        isNew: false,
                        children: [],
                        action: this.props.onChangeNoteType,
                      },
                    ]}
                    selected={this.props.noteType.color}
                    alignment="FILL"
                    isNew={
                      features.find(
                        (feature) =>
                          feature.name === 'SETTINGS_NOTE_TYPES_UPDATE_COLOR'
                      )?.isNew
                    }
                  />
                </div>
              </>
            </Feature>
          </div>
          <div className="list__item__right-part">
            <Button
              type="icon"
              icon="minus"
              feature="REMOVE_NOTE_TYPE"
              action={this.props.onChangeNoteType}
            />
          </div>
        </div>
        {this.state.hasMoreOptions && (
          <div className="list__item__secondary"></div>
        )}
      </li>
    )
  }
}
